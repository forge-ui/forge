import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/app/templates/task-board/_data.ts", import.meta.url), "utf8");
const collaborationSource = await readFile(new URL("../src/app/templates/task-board/_collaboration.ts", import.meta.url), "utf8");
const collaborationCode = ts.transpileModule(collaborationSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const collaborationUrl = `data:text/javascript;base64,${Buffer.from(collaborationCode).toString("base64")}`;
const compiled = ts.transpileModule(source.replace('"./_collaboration"', JSON.stringify(collaborationUrl)), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 } }).outputText;
const { taskMatchesWorkspaceScope, seedBoard, migrateBoard, projectSections, emptyBoard, isBoard, recordTaskChange, nextRepeatDate, writeTasks, copyTask, copySubtask, copyProject, copySection, moveSection, setSectionArchived, taskIsArchived, collectTaskLabels, taskSearchEntries, taskDetailHash, parseTaskDetailHash, sectionLinkHash, parseSectionLinkHash, hasSubtaskPath } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const legacy = seedBoard();
const migrated = migrateBoard(legacy);
const labelTree = [{ labels: ["Design"], subtasks: [{ labels: ["design", "评审"], subtasks: [{ labels: ["移动端"] }] }] }];
const originalLabelTree = structuredClone(labelTree);
assert.deepEqual(new Set(collectTaskLabels(labelTree)), new Set(["Design", "评审", "移动端"]));
assert.deepEqual(collectTaskLabels([]), []);
assert.deepEqual(labelTree, originalLabelTree);
console.log("PASS: recursive workspace label discovery, case-insensitive canonical labels and immutable source");
assert.equal(migrated.tasks.length, 9);
const content = task => Object.fromEntries(Object.entries(task).filter(([key]) => key !== "section"));
assert.deepEqual(migrated.tasks.map(content), legacy.tasks.map(content));
assert.equal(new Set(migrated.sections.map(section => section.id)).size, migrated.sections.length);
assert.ok(migrated.tasks.every(task => projectSections(migrated, task.project).some(section => section.id === task.section)));
assert.deepEqual(migrateBoard(migrated), migrated);
assert.ok(isBoard(migrated));
const otherProjectSection = projectSections(migrated, "日常工作")[0];
assert.equal(isBoard({ ...migrated, tasks: [{ ...migrated.tasks[0], section: otherProjectSection.id }] }), false);
const renamed = { ...migrated, sections: migrated.sections.map(section => section.id === migrated.tasks[0].section ? { ...section, title: "已重命名" } : section) };
assert.deepEqual(projectSections(renamed, "日常工作"), projectSections(migrated, "日常工作"));
const fresh = emptyBoard("独立项目");
assert.equal(fresh.tasks.length, 0);
assert.equal(projectSections(fresh, "独立项目").length, 3);
assert.ok(isBoard(fresh));
console.log("PASS: project section isolation, legacy migration, task preservation, repeat migration, invalid ownership rejection, independent empty workspace");

const originalTask = migrated.tasks.find(task => !task.done);
const at = "2026-10-20T08:30:00.000Z";
const finished = recordTaskChange(originalTask, { ...originalTask, done: true }, at);
assert.equal(finished.completedAt, at);
assert.equal(finished.activity.at(-1).text, "完成了任务");
assert.equal(originalTask.completedAt, undefined);
assert.equal(originalTask.done, false);
const described = recordTaskChange(finished, { ...finished, description: "Updated description" }, "2026-10-20T08:31:00.000Z");
assert.equal(described.completedAt, at);
assert.equal(described.activity.length, finished.activity.length + 1);
const reopened = recordTaskChange(described, { ...described, done: false }, "2026-10-20T08:32:00.000Z");
assert.equal(reopened.completedAt, undefined);
assert.equal(reopened.activity.at(-1).text, "重新打开了任务");
const finishedAgain = recordTaskChange(reopened, { ...reopened, done: true }, "2026-10-20T08:33:00.000Z");
assert.equal(finishedAgain.completedAt, "2026-10-20T08:33:00.000Z");
assert.deepEqual(recordTaskChange(finishedAgain, { ...finishedAgain }), finishedAgain);
assert.ok(isBoard({ ...migrated, tasks: [finishedAgain] }));
assert.equal(isBoard({ ...migrated, tasks: [{ ...finishedAgain, completedAt: "invalid" }] }), false);
assert.equal(isBoard({ ...migrated, tasks: [{ ...finishedAgain, activity: [{ id: "bad", text: "bad", at: "invalid" }] }] }), false);
assert.deepEqual(migrated.tasks.find(task => task.id === originalTask.id), originalTask);
console.log("PASS: completion timestamps, reopen and recomplete, edit timestamp stability, no-op history, valid persistence, invalid timestamp rejection, immutable undo source");
const labelled = recordTaskChange(originalTask, { ...originalTask, labels: ["设计评审"] }, at);
assert.ok(isBoard({ ...migrated, tasks: [labelled] }));
assert.equal(labelled.activity.at(-1).text, "更新了任务标签");
assert.equal(isBoard({ ...migrated, tasks: [{ ...originalTask, labels: [""] }] }), false);
assert.equal(isBoard({ ...migrated, tasks: [{ ...originalTask, labels: ["x".repeat(41)] }] }), false);
assert.equal(isBoard({ ...migrated, tasks: [{ ...originalTask, labels: [123] }] }), false);
assert.deepEqual(recordTaskChange(labelled, { ...labelled, labels: [...labelled.labels] }).activity, labelled.activity);
console.log("PASS: label persistence, label activity, invalid label rejection, unchanged labels preserve history");

assert.equal(nextRepeatDate("2026-10-23", "weekdays", "2026-10-23"), "2026-10-26");
assert.equal(nextRepeatDate("2026-01-31", "monthly", "2026-01-31"), "2026-02-28");
assert.equal(nextRepeatDate("2026-02-28", "monthly", "2026-02-28", 31), "2026-03-31");
assert.equal(nextRepeatDate("2024-02-29", "yearly", "2027-02-28", 29), "2028-02-29");
const repeating = { ...originalTask, date: "2026-10-20", time: "09:30", repeat: "daily", subtasks: [{ id: "child", title: "Checked step", done: true, description: "Details", priority: "P2", attachments: [{ id: "file", name: "notes.txt", url: "data:text/plain;base64,aGk=", size: 2 }] }] };
const advanced = writeTasks([repeating], [{ ...repeating, done: true }], at);
assert.equal(advanced.length, 2);
assert.equal(advanced[0].id, repeating.id);
assert.equal(advanced[0].date, "2026-10-21");
assert.equal(advanced[0].done, false);
assert.equal(advanced[0].time, "09:30");
assert.deepEqual(advanced[0].subtasks, repeating.subtasks);
assert.equal(advanced[1].done, true);
assert.equal(advanced[1].repeat, undefined);
assert.equal(repeating.date, "2026-10-20");
assert.ok(isBoard({ ...migrated, tasks: advanced }));
assert.deepEqual(JSON.parse(JSON.stringify(advanced[0])).subtasks, repeating.subtasks);
for (const patch of [{ priority: "bad" }, { description: 4 }, { attachments: [{ id: "x", name: "x", size: 1, url: "javascript:alert(1)" }] }]) {
  assert.equal(isBoard({ ...migrated, tasks: [{ ...originalTask, subtasks: [{ ...repeating.subtasks[0], ...patch }] }] }), false);
}
console.log("PASS: repeat weekday/month/leap-year dates, completion history, preserved subtask completion and rich details, immutable source, attachment persistence and unsafe URL rejection");

const viewSource = await readFile(new URL("../src/app/templates/task-board/_view-preferences.ts", import.meta.url), "utf8");
const dataModuleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const viewCompiled = ts.transpileModule(viewSource.replace('"./_collaboration"', JSON.stringify(collaborationUrl)), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText.replace('from "./_data"', `from "${dataModuleUrl}"`);
const { DEFAULT_VIEW, parseViewPreferences, matchesDateFilter, projectTaskGroups, viewKey, matchesCollaboration } = await import(`data:text/javascript;base64,${Buffer.from(viewCompiled).toString("base64")}`);
const projectKey = viewKey("workspace", "project");
assert.deepEqual(parseViewPreferences({ [projectKey]: { view: 1, sort: "date", showDone: true } })[projectKey], { ...DEFAULT_VIEW, view: 1, sort: "date", showDone: true });
assert.equal(parseViewPreferences({ [projectKey]: { ...DEFAULT_VIEW, group: "invalid", dateFilter: "invalid" } })[projectKey].group, "section");
assert.equal(matchesDateFilter("", "none", "2026-10-20"), true);
assert.equal(matchesDateFilter("", "today", "2026-10-20"), false);
assert.equal(matchesDateFilter("2026-10-26", "next7", "2026-10-20"), true);
assert.equal(matchesDateFilter("2026-10-27", "next7", "2026-10-20"), false);
assert.equal(matchesDateFilter("2026-10-19", "week", "2026-10-25"), true);
assert.equal(matchesDateFilter("2026-10-26", "week", "2026-10-25"), false);
assert.equal(matchesDateFilter("2026-11-01", "month", "2026-10-20"), false);
assert.equal(matchesDateFilter("2026-11-18", "next30", "2026-10-20"), true);
assert.equal(matchesDateFilter("2026-11-19", "next30", "2026-10-20"), false);
const groupTasks = [
  { ...originalTask, id: "group-a", priority: "1", date: "2026-10-20", labels: ["设计", "评审"] },
  { ...originalTask, id: "group-b", priority: "4", date: "", labels: [] },
];
assert.deepEqual(projectTaskGroups(migrated, originalTask.project, groupTasks, "priority").map(group => group.tasks.length), [1, 0, 0, 1]);
assert.deepEqual(projectTaskGroups(migrated, originalTask.project, groupTasks, "date").map(group => group.date), ["2026-10-20", ""]);
const labelGroups = projectTaskGroups(migrated, originalTask.project, groupTasks, "label");
assert.equal(labelGroups.filter(group => group.tasks.some(task => task.id === "group-a")).length, 2);
assert.equal(labelGroups.find(group => group.id === "label:none").tasks[0].id, "group-b");
assert.ok(isBoard({ ...migrated, sections: migrated.sections.map(section => ({ ...section, description: "分区描述" })) }));
assert.equal(isBoard({ ...migrated, sections: migrated.sections.map(section => ({ ...section, description: 5 })) }), false);
console.log("PASS: view preference migration, date range boundaries, grouping membership, and section description validation");

const discussionTask = { ...originalTask, subtasks: [{ id: "rich-child", title: "子任务", done: false, labels: ["评审"], comments: [{ id: "comment-1", at: "2026-10-20T08:00:00.000Z", text: "补充进展" }] }] };
const discussionBoard = { ...migrated, tasks: migrated.tasks.map(task => task.id === originalTask.id ? discussionTask : task) };
assert.ok(isBoard(JSON.parse(JSON.stringify(discussionBoard))));
assert.equal(isBoard({ ...discussionBoard, tasks: [{ ...discussionTask, subtasks: [{ ...discussionTask.subtasks[0], comments: [{ id: "bad", at: "invalid", text: "x" }] }] }] }), false);
assert.equal(isBoard({ ...discussionBoard, tasks: [{ ...discussionTask, subtasks: [{ ...discussionTask.subtasks[0], labels: [""] }] }] }), false);
assert.equal(recordTaskChange(originalTask, discussionTask, "2026-10-20T08:00:00.000Z").activity.at(-1).text, "更新了子任务");
console.log("PASS: subtask label and comment persistence, validation and parent activity");

const attachedTask = { ...originalTask, attachments: [{ id: "parent-file", name: "notes.txt", url: "data:text/plain;base64,aGk=", size: 2 }] };
assert.ok(isBoard(JSON.parse(JSON.stringify({ ...migrated, tasks: [attachedTask] }))));
assert.equal(recordTaskChange(originalTask, attachedTask, at).activity.at(-1).text, "更新了任务附件");
assert.deepEqual(recordTaskChange(attachedTask, { ...attachedTask, attachments: [...attachedTask.attachments] }, at).activity, attachedTask.activity);
assert.equal(recordTaskChange(attachedTask, { ...attachedTask, attachments: [] }, at).activity.at(-1).text, "更新了任务附件");
for (const file of [{ ...attachedTask.attachments[0], url: "javascript:alert(1)" }, { ...attachedTask.attachments[0], size: 500 * 1024 + 1 }]) {
  assert.equal(isBoard({ ...migrated, tasks: [{ ...attachedTask, attachments: [file] }] }), false);
}
console.log("PASS: main task attachment persistence, add/remove activity, unchanged history and invalid attachment rejection");

const nestedTask = { ...originalTask, subtasks: [{ id: "level-one", title: "一级", done: false, subtasks: [{ id: "level-two", title: "二级", done: true, description: "保留详情", attachments: attachedTask.attachments, comments: [{ id: "nested-comment", text: "进展", at }], subtasks: [{ id: "level-three", title: "三级", done: false }] }] }] };
assert.ok(isBoard(JSON.parse(JSON.stringify({ ...migrated, tasks: [nestedTask] }))));
assert.equal(isBoard({ ...migrated, tasks: [{ ...originalTask, subtasks: [{ ...nestedTask.subtasks[0], subtasks: [null] }] }] }), false);
const cyclicChildren = [];
cyclicChildren.push({ id: "cycle", title: "循环", done: false, subtasks: cyclicChildren });
assert.equal(isBoard({ ...migrated, tasks: [{ ...originalTask, subtasks: cyclicChildren }] }), false);
assert.equal(recordTaskChange(originalTask, nestedTask, at).activity.at(-1).text, "更新了子任务");
console.log("PASS: nested subtask persistence, rich details, malformed descendants and cycles rejected, parent activity");

// Custom recurrence: preserve cadence or restart from completion, with explicit ends.
assert.equal(nextRepeatDate('2026-10-01', 'weekly', '2026-10-20', 1, {interval:2,basis:'scheduled'}), '2026-10-29');
assert.equal(nextRepeatDate('2026-10-01', 'weekly', '2026-10-20', 1, {interval:2,basis:'completed'}), '2026-11-03');
assert.equal(nextRepeatDate('2026-01-31', 'monthly', '2026-01-31', 31, {interval:2,basis:'scheduled'}), '2026-03-31');
assert.equal(nextRepeatDate('2026-10-01', 'weekdays', '2026-10-23', 1, {interval:2,basis:'completed'}), '2026-10-27');
const recurring = {...originalTask, date:'2026-10-20', time:'09:30', repeat:'weekly', repeatRule:{interval:2,basis:'scheduled',remaining:2}};
const firstRun = writeTasks([recurring], [{...recurring,done:true}], at);
assert.equal(firstRun.length, 2);
assert.equal(firstRun[0].date, '2026-11-03');
assert.equal(firstRun[0].repeatRule.remaining, 1);
assert.equal(firstRun[0].done, false);
assert.equal(firstRun[1].repeatRule, undefined);
const lastRun = writeTasks(firstRun, firstRun.map((item,index)=>index === 0 ? {...item,done:true} : item), '2026-11-03T08:30:00.000Z');
assert.equal(lastRun.length, 2);
assert.equal(lastRun[0].done, true);
assert.equal(lastRun[0].repeat, undefined);
const ended = {...recurring,repeatRule:{interval:2,basis:'scheduled',until:'2026-10-30'}};
assert.equal(writeTasks([ended],[{...ended,done:true}],at)[0].done,true);
const child = {id:'repeating-child', title:'重复子任务', done:false, date:'2026-10-20', time:'10:15',repeat:'daily',repeatRule:{interval:3,basis:'completed',remaining:2},attachments:[]};
const parent = {...originalTask,subtasks:[{id:'nested-parent',title:'父层',done:false,subtasks:[child]}]};
const childCompleted = structuredClone(parent);
childCompleted.subtasks[0].subtasks[0].done = true;
const nestedRun = writeTasks([parent],[childCompleted],at)[0];
const nextChild = nestedRun.subtasks[0].subtasks[0];
assert.equal(nextChild.date,'2026-10-23');
assert.equal(nextChild.time,'10:15');
assert.equal(nextChild.done,false);
assert.equal(nextChild.repeatRule.remaining,1);
assert.deepEqual(nextChild.completionHistory,[{at,date:'2026-10-20'}]);
assert.ok(isBoard({...migrated,tasks:[nestedRun]}));
assert.deepEqual(child.repeatRule,{interval:3,basis:'completed',remaining:2});
for (const repeatRule of [{interval:0,basis:'scheduled'},{interval:1.5,basis:'scheduled'},{interval:1000,basis:'completed'},{interval:1,basis:'invalid'},{interval:1,basis:'scheduled',remaining:0},{interval:1,basis:'scheduled',until:'2026-02-30'}]) {
 assert.equal(isBoard({...migrated,tasks:[{...recurring,repeatRule}]}),false);
 assert.equal(isBoard({...migrated,tasks:[{...parent,subtasks:[{...child,repeatRule}]}]}),false);
}
console.log('PASS: custom recurrence interval, completion basis, business days, month anchors, count/date ends, nested child history and malformed rules');
const finalChildInput = structuredClone(nestedRun);
finalChildInput.subtasks[0].subtasks[0].done = true;
const finalChild = writeTasks([nestedRun],[finalChildInput],at)[0].subtasks[0].subtasks[0];
assert.equal(finalChild.done,true);
assert.equal(finalChild.repeat,undefined);
assert.equal(finalChild.completionHistory.length,2);
const inclusive = {...recurring, repeat:'daily', repeatRule:{interval:1,basis:'scheduled',until:'2026-10-21'}};
const inclusiveRun = writeTasks([inclusive],[{...inclusive,done:true}],at);
assert.equal(inclusiveRun[0].date,'2026-10-21');
assert.equal(inclusiveRun[0].done,false);
const inclusiveEnd = writeTasks(inclusiveRun,inclusiveRun.map((item,index)=>index === 0 ? {...item,done:true} : item),'2026-10-21T08:30:00.000Z');
assert.equal(inclusiveEnd[0].done,true);
assert.equal(inclusiveEnd[0].repeat,undefined);
console.log('PASS: nested child final occurrence and inclusive end-date boundary');

const sourceWithChildren = structuredClone(migrated.tasks.find(task => task.subtasks.length));
sourceWithChildren.subtasks[0].subtasks = [{ id: "nested-copy-source", title: "Nested", done: false }];
const independentCopy = copyTask(sourceWithChildren);
assert.notEqual(independentCopy.id, sourceWithChildren.id);
assert.notEqual(independentCopy.subtasks[0].id, sourceWithChildren.subtasks[0].id);
assert.notEqual(independentCopy.subtasks[0].subtasks[0].id, "nested-copy-source");
independentCopy.subtasks[0].title = "Copy only";
assert.notEqual(sourceWithChildren.subtasks[0].title, "Copy only");
const beforeCopy = structuredClone(migrated);
const sectionCopy = copySection(migrated, sourceWithChildren.section);
const sourceSectionIndex = migrated.sections.findIndex(section => section.id === sourceWithChildren.section);
const addedSection = sectionCopy.sections[sourceSectionIndex + 1];
assert.notEqual(addedSection.id, sourceWithChildren.section);
assert.equal(addedSection.description, migrated.sections[sourceSectionIndex].description);
assert.equal(sectionCopy.tasks.filter(task => task.section === addedSection.id).length, migrated.tasks.filter(task => task.section === sourceWithChildren.section).length);
assert.ok(isBoard(sectionCopy));
assert.deepEqual(migrated, beforeCopy);
const secondCopy = copySection(sectionCopy, sourceWithChildren.section);
assert.match(secondCopy.sections[sourceSectionIndex + 1].title, /副本 2/);
assert.ok(isBoard(JSON.parse(JSON.stringify(secondCopy))));
assert.equal(copySection(migrated, "missing"), migrated);
console.log("PASS: independent recursive task identities, section copy placement and content, unique copy names, immutable source and persisted validation");

const moveSource = migrated.sections.find(section => section.project === "品牌焕新计划");
const movedSectionBoard = moveSection(migrated, moveSource.id, "日常工作");
assert.equal(movedSectionBoard.sections.find(section => section.id === moveSource.id).project, "日常工作");
assert.ok(movedSectionBoard.tasks.filter(task => task.section === moveSource.id).every(task => task.project === "日常工作"));
assert.ok(isBoard(movedSectionBoard));
assert.deepEqual(migrated, beforeCopy);
assert.equal(moveSection(migrated, moveSource.id, "missing"), migrated);
assert.equal(moveSection(migrated, moveSource.id, moveSource.project), migrated);
assert.equal(moveSection({ ...migrated, archived: ["日常工作"] }, moveSource.id, "日常工作").sections.find(section => section.id === moveSource.id).project, moveSource.project);
const soleSource = { ...migrated, sections: migrated.sections.filter(section => section.project !== moveSource.project || section.id === moveSource.id), tasks: migrated.tasks.filter(task => task.project !== moveSource.project || task.section === moveSource.id) };
const soleMoved = moveSection(soleSource, moveSource.id, "日常工作");
assert.equal(projectSections(soleMoved, moveSource.project).length, 1);
assert.notEqual(projectSections(soleMoved, moveSource.project)[0].id, moveSource.id);
assert.ok(isBoard(JSON.parse(JSON.stringify(soleMoved))));
console.log("PASS: section move ownership, target naming, immutable source, invalid/archived destination rejection and last-section fallback");

const archivedSectionBoard = setSectionArchived(migrated, moveSource.id, true);
assert.ok(!projectSections(archivedSectionBoard, moveSource.project).some(section => section.id === moveSource.id));
assert.ok(projectSections(archivedSectionBoard, moveSource.project, true).some(section => section.id === moveSource.id));
assert.deepEqual(archivedSectionBoard.tasks, migrated.tasks);
assert.ok(archivedSectionBoard.tasks.filter(task => task.section === moveSource.id).every(task => taskIsArchived(archivedSectionBoard, task)));
assert.ok(isBoard(JSON.parse(JSON.stringify(archivedSectionBoard))));
const restoredSectionBoard = setSectionArchived(archivedSectionBoard, moveSource.id, false);
assert.ok(projectSections(restoredSectionBoard, moveSource.project).some(section => section.id === moveSource.id));
assert.deepEqual(restoredSectionBoard.tasks, migrated.tasks);
const soleArchived = setSectionArchived(soleSource, moveSource.id, true);
assert.equal(projectSections(soleArchived, moveSource.project).length, 1);
assert.ok(isBoard(soleArchived));
const soleRestored = setSectionArchived(soleArchived, moveSource.id, false);
assert.equal(new Set(projectSections(soleRestored, moveSource.project).map(section => section.title)).size, 2);
const archivedFallback = projectSections(soleArchived, moveSource.project)[0];
const archivedTwice = setSectionArchived(soleArchived, archivedFallback.id, true);
assert.equal(new Set(projectSections(archivedTwice, moveSource.project, true).map(section => section.title)).size, 3);
const archivedTarget = { ...migrated, sections: [...migrated.sections, { id: "archived-name", title: moveSource.title, project: "日常工作", archived: true }] };
const movedIntoArchivedName = moveSection(archivedTarget, moveSource.id, "日常工作");
assert.notEqual(movedIntoArchivedName.sections.find(section => section.id === moveSource.id).title, moveSource.title);
assert.equal(isBoard({ ...migrated, sections: migrated.sections.map(section => ({ ...section, archived: "yes" })) }), false);
assert.deepEqual(migrated, beforeCopy);
console.log("PASS: section archive/restore visibility, task content preservation, active fallback, archived task matching and persisted validation");

const commentFile = { id: "comment-file", name: "review.txt", url: "data:text/plain;base64,aGk=", size: 2 };
const richComment = { id: "rich-comment", author: "林晓", at, text: "", attachments: [commentFile] };
const richDiscussion = { ...originalTask, comments: ["旧成员：旧版评论", richComment], subtasks: [{ id: "comment-child", title: "附件讨论", done: false, comments: [richComment] }] };
const richDiscussionBoard = { ...migrated, tasks: [richDiscussion] };
assert.ok(isBoard(JSON.parse(JSON.stringify(richDiscussionBoard))));
assert.equal(isBoard({ ...migrated, tasks: [{ ...richDiscussion, comments: [{ ...richComment, attachments: [{ ...commentFile, url: "javascript:alert(1)" }] }] }] }), false);
assert.equal(isBoard({ ...migrated, tasks: [{ ...richDiscussion, subtasks: [{ ...richDiscussion.subtasks[0], comments: [{ ...richComment, attachments: [{ ...commentFile, size: 500 * 1024 + 1 }] }] }] }] }), false);
const copiedDiscussion = copyTask(richDiscussion);
assert.notEqual(copiedDiscussion.comments[1].id, richComment.id);
assert.notEqual(copiedDiscussion.comments[1].attachments[0].id, commentFile.id);
assert.notEqual(copiedDiscussion.subtasks[0].comments[0].id, richComment.id);
assert.notEqual(copiedDiscussion.subtasks[0].comments[0].attachments[0].id, commentFile.id);
copiedDiscussion.comments[1].attachments[0].name = "changed.txt";
assert.equal(richComment.attachments[0].name, "review.txt");
assert.equal(copiedDiscussion.comments[0], "旧成员：旧版评论");
console.log("PASS: legacy/rich comments, attachment-only persistence, unsafe and oversized comment files rejected, recursive independent comment/file identities");

const searchBoard = structuredClone(migrated);
searchBoard.tasks[0].subtasks = [{ id: "child/id", title: "同名", done: false, description: "独立描述", labels: ["深层标签"], subtasks: [{ id: "孙任务%", title: "深层目标", done: true }] }];
const beforeSearch = structuredClone(searchBoard);
const searchEntries = taskSearchEntries(searchBoard);
const deepEntry = searchEntries.find(entry => entry.item.title === "深层目标");
assert.deepEqual(deepEntry.path, ["child/id", "孙任务%"]);
assert.ok(deepEntry.context.includes("同名"));
assert.ok(hasSubtaskPath(deepEntry.task, deepEntry.path));
assert.equal(hasSubtaskPath(deepEntry.task, ["missing"]), false);
assert.deepEqual(parseTaskDetailHash(`#${taskDetailHash(deepEntry.task.id, deepEntry.path)}`), { id: deepEntry.task.id, path: deepEntry.path });
assert.deepEqual(parseTaskDetailHash("#task/root"), { id: "root", path: [] });
for (const hash of ["#task/%", "#task/root/", "#task/", "#other/root"]) assert.equal(parseTaskDetailHash(hash), null);
assert.deepEqual(searchBoard, beforeSearch);
assert.equal(taskSearchEntries({ ...searchBoard, archived: [...searchBoard.projects] }).length, 0);
assert.equal(taskSearchEntries({ ...searchBoard, sections: searchBoard.sections.map(section => ({ ...section, archived: true })) }).length, 0);
console.log("PASS: recursive search context, deep-link encoded identity, invalid hash handling, missing descendants, archived-tree exclusion and immutable data");

const projectSource = structuredClone(searchBoard);
projectSource.projectDetails = { [projectSource.tasks[0].project]: { status: "进行中", owner: "林晓", priority: "中", description: "复制说明" } };
const projectName = projectSource.tasks[0].project;
const projectSnapshot = structuredClone(projectSource);
const projectCopy = copyProject(projectSource, projectName, "完整副本");
assert.ok(isBoard(projectCopy));
assert.deepEqual(projectSource, projectSnapshot);
const sourceTasks = projectSource.tasks.filter(task => task.project === projectName);
const copiedTasks = projectCopy.tasks.filter(task => task.project === "完整副本");
assert.equal(sourceTasks.length, copiedTasks.length);
assert.equal(projectCopy.sections.filter(section => section.project === "完整副本").length, projectSource.sections.filter(section => section.project === projectName).length);
for (let i = 0; i < sourceTasks.length; i++) {
  assert.notEqual(copiedTasks[i].id, sourceTasks[i].id);
  assert.notEqual(copiedTasks[i].section, sourceTasks[i].section);
  assert.equal(copiedTasks[i].done, sourceTasks[i].done);
  assert.equal(copiedTasks[i].title, sourceTasks[i].title);
}
assert.notEqual(copiedTasks[0].subtasks[0].id, sourceTasks[0].subtasks[0].id);
assert.notEqual(copiedTasks[0].subtasks[0].subtasks[0].id, sourceTasks[0].subtasks[0].subtasks[0].id);
projectCopy.projectDetails["完整副本"].description = "独立变更";
assert.equal(projectSource.projectDetails[projectName].description, "复制说明");
for (const name of [projectName, "", "今天"]) assert.equal(copyProject(projectSource, projectName, name), projectSource);
assert.equal(copyProject(projectSource, "不存在", "新副本"), projectSource);
console.log("PASS: complete project duplication, independent recursive identities and metadata, completion preservation, invalid target rejection and immutable source");

const archivedCopySource = structuredClone(projectSource);
archivedCopySource.sections.find(section => section.project === projectName).archived = true;
const archivedProjectCopy = copyProject(archivedCopySource, projectName, "含归档分区副本");
assert.equal(archivedProjectCopy.sections.filter(section => section.project === "含归档分区副本" && section.archived).length, 1);
const resolvedCopy = copyProject({ ...projectSource, projectDetails: undefined }, projectName, "默认说明副本", { status: "进行中", owner: "林晓", priority: "中", description: "实际可见说明" });
assert.equal(resolvedCopy.projectDetails["默认说明副本"].description, "实际可见说明");
console.log("PASS: archived sections retained and displayed default project metadata copied explicitly");

const projectDiscussion = { id: "project-comment", text: "项目整体讨论", author: "林晓", at, attachments: [{ id: "project-file", name: "note.txt", size: 1, url: "data:text/plain;base64,YQ==" }] };
const discussedBoard = { ...migrated, projectComments: { [projectName]: [projectDiscussion] } };
assert.ok(isBoard(discussedBoard));
assert.ok(isBoard(JSON.parse(JSON.stringify(discussedBoard))));
assert.equal(isBoard({ ...discussedBoard, projectComments: { bad: [{ id: "bad", text: "bad", at: "not-a-date" }] } }), false);
assert.equal(isBoard({ ...discussedBoard, projectComments: { bad: [{ ...projectDiscussion, attachments: [{ id: "bad", name: "bad", size: 1, url: "javascript:alert(1)" }] }] } }), false);
const discussionCopy = copyProject(discussedBoard, projectName, "含讨论副本");
assert.notEqual(discussionCopy.projectComments["含讨论副本"][0].id, projectDiscussion.id);
assert.notEqual(discussionCopy.projectComments["含讨论副本"][0].attachments[0].id, projectDiscussion.attachments[0].id);
discussionCopy.projectComments["含讨论副本"][0].text = "副本讨论变更";
assert.equal(discussedBoard.projectComments[projectName][0].text, "项目整体讨论");
console.log("PASS: project comments round trip, malformed time/attachment rejection and independent copied discussion identities");

const childCopySource = { id: "child-copy-source", title: "Child", done: true, labels: ["design"], subtasks: [{ id: "grandchild-copy-source", title: "Grandchild", done: false, labels: ["nested"] }] };
const childCopySnapshot = structuredClone(childCopySource);
const childCopyResult = copySubtask(childCopySource, { title: "Child copy", done: false });
assert.notEqual(childCopyResult.id, childCopySource.id);
assert.notEqual(childCopyResult.subtasks[0].id, childCopySource.subtasks[0].id);
assert.equal(childCopyResult.done, false);
childCopyResult.labels.push("copy-only");
childCopyResult.subtasks[0].labels.push("copy-only");
assert.deepEqual(childCopySource, childCopySnapshot);
assert.equal(childCopyResult.title, "Child copy");
console.log("PASS: standalone child duplicate has recursive independent identity and content");

for (const id of ['品牌项目:准备开始', 'with / slash?#', '分区😀']) assert.equal(parseSectionLinkHash(`#${sectionLinkHash(id)}`), id);
for (const hash of ['#section/', '#section/%', '#task/root', '#other/section']) assert.equal(parseSectionLinkHash(hash), null);
console.log('PASS: section deep-link encoding and malformed hash rejection');

// Collaboration stays independent from section moves and survives JSON persistence.
const { transitionCollaboration, validCollaboration } = await import(collaborationUrl);
const collaborationSeed = migrated.tasks.find(task => task.collaboration?.state === "ready");
const start = transitionCollaboration(collaborationSeed.collaboration, "running", "started", { attempt: 1 });
assert.equal(collaborationSeed.collaboration.state, "ready");
assert.throws(() => transitionCollaboration(start, "approved", "invalid bypass"));
assert.throws(() => transitionCollaboration(start, "review", "missing result"));
const reviewRun = transitionCollaboration(start, "review", "submitted", { result: "## Delivery\n- Evidence" });
assert.equal(validCollaboration(JSON.parse(JSON.stringify(reviewRun))), true);
assert.equal(reviewRun.events.at(-1).detail, "## Delivery\n- Evidence");
const acceptedRun = transitionCollaboration(reviewRun, "approved", "accepted", { feedback: "Approved with evidence" });
assert.equal(acceptedRun.events.at(-1).detail, "Approved with evidence");
assert.throws(() => transitionCollaboration(acceptedRun, "running", "invalid restart"));
assert.equal(validCollaboration({ ...reviewRun, events: [{ id: "bad", text: "bad", at: "invalid" }] }), false);
assert.equal(isBoard({ ...migrated, tasks: [{ ...collaborationSeed, collaboration: { ...reviewRun, state: "invalid" } }] }), false);
const collaborationTasks = [
  { ...collaborationSeed, id: "ready" },
  { ...collaborationSeed, id: "review", collaboration: reviewRun },
  { ...collaborationSeed, id: "failed", collaboration: { ...start, state: "failed" } },
  { ...collaborationSeed, id: "waiting", collaboration: { ...start, state: "waiting" } },
  { ...collaborationSeed, id: "human", collaboration: undefined },
];
assert.deepEqual(collaborationTasks.filter(task => matchesCollaboration(task, "attention")).map(task => task.id), ["review", "failed", "waiting"]);
assert.deepEqual(collaborationTasks.filter(task => matchesCollaboration(task, "human")).map(task => task.id), ["human"]);
assert.deepEqual(projectTaskGroups(migrated, collaborationSeed.project, collaborationTasks, "collaboration").flatMap(group => group.tasks).map(task => task.id).sort(), collaborationTasks.map(task => task.id).sort());
assert.equal(parseViewPreferences({ [projectKey]: { ...DEFAULT_VIEW, collaboration: "invalid" } })[projectKey].collaboration, "all");
const savedView = { ...DEFAULT_VIEW, group: "collaboration", collaboration: "attention" };
assert.deepEqual(parseViewPreferences(JSON.parse(JSON.stringify({ [projectKey]: savedView })))[projectKey], savedView);
console.log("PASS: collaboration state guards, immutable history, JSON validation, attention filtering, unique grouping and view preference migration");

const activeTask = { ...collaborationSeed, collaboration: start };
const doneActive = writeTasks([activeTask], [{ ...activeTask, done: true }])[0];
assert.equal(doneActive.collaboration.state, "paused");
assert.equal(activeTask.collaboration.state, "running");
assert.equal(writeTasks([doneActive], [{ ...doneActive, done: false }])[0].collaboration.state, "paused");
console.log("PASS: completing an active task pauses the simulation; reopening never auto-starts execution");

const configuredWorkspace = {
 ...migrated,
 agents: [{ id: "agent-local", name: "本地助手", description: "职责", instructions: "先确认目标" }],
 resources: [{ id: "reference-local", title: "参考资料", content: "## 目标\n\n保留来源", createdAt: "2026-10-28T00:00:00.000Z", attachments: [{ id: "file-local", name: "notes.md", url: "data:text/plain;base64,YQ==", size: 1 }] }],
};
assert.ok(isBoard(JSON.parse(JSON.stringify(configuredWorkspace))));
assert.deepEqual(migrateBoard(configuredWorkspace).agents, configuredWorkspace.agents);
assert.deepEqual(migrateBoard(configuredWorkspace).resources, configuredWorkspace.resources);
assert.ok(isBoard(migrated), "Legacy spaces remain valid without catalog fields");
assert.equal(isBoard({ ...configuredWorkspace, agents: [...configuredWorkspace.agents, ...configuredWorkspace.agents] }), false);
assert.equal(isBoard({ ...configuredWorkspace, resources: [{ ...configuredWorkspace.resources[0], attachments: [{ id:"bad",name:"bad",url:"javascript:alert(1)",size:1 }] }] }), false);
assert.equal(isBoard({ ...configuredWorkspace, resources: [{ ...configuredWorkspace.resources[0], content: null }] }), false);
assert.equal(emptyBoard("独立空间").agents, undefined);
assert.equal(emptyBoard("独立空间").resources, undefined);
console.log("PASS: optional workspace catalogs survive JSON and migration; duplicate IDs and unsafe attachments rejected; new spaces are isolated");

assert.equal(migrated.tasks.filter(t=>taskMatchesWorkspaceScope(migrated,t,"全部任务")).length,migrated.tasks.length);
assert.ok(migrated.tasks.filter(t=>taskMatchesWorkspaceScope(migrated,t,"日常工作")).every(t=>t.project==="日常工作"));
const scopedArchive={...migrated,archived:["日常工作"]};
assert.ok(scopedArchive.tasks.filter(t=>taskMatchesWorkspaceScope(scopedArchive,t,"全部任务")).every(t=>t.project!=="日常工作"));
assert.ok(scopedArchive.tasks.some(t=>taskMatchesWorkspaceScope(scopedArchive,t,"日常工作")));
assert.equal(taskMatchesWorkspaceScope(migrated,{...migrated.tasks[0],date:"2026-10-27"},"今天","2026-10-28"),true);
assert.equal(taskMatchesWorkspaceScope(migrated,{...migrated.tasks[0],date:""},"今天","2026-10-28"),false);
assert.equal(taskMatchesWorkspaceScope(migrated,{...migrated.tasks[0],date:"2026-10-29"},"即将到来","2026-10-28"),true);
console.log("PASS: global task scope includes all current-space projects; project, archive and date scopes stay bounded");
