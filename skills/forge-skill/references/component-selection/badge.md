## 选型

| 场景 | 选 |
|---|---|
| 铃铛未读数 / 角标 | `NotificationBadge` |
| 业务页状态 / 分类 / 角色 / 标签 | **纯文本**（危险红字、失效灰字、其余黑字），不用本节组件 |
| 营销页强调 Tag（新功能、VIP，产品方明确要求） | `Label variant="solid"` |
| 图标美化 | `CircleIcon`（圆底） / `ArtisticIcon`（装饰） |
| 表格状态列 | 纯文本（`CellText`/`CellMuted`），**不用** `StatusBadge`/`Label` |
