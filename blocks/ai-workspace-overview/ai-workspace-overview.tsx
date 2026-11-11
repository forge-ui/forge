"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Breadcrumbs, Button, ButtonGroup, KebabMenu, LineChartStatCard, ListGroup, PageTitleToolbar, PlusIcon, ProgressStatCard, SelectOption, SmoothLineChart } from "@forge-ui-official/core";

export interface WorkspaceAggregation {
  application: { total: number; published: number; unpublished: number };
  knowledge: { total: number; documents: number; failures: number };
  tool: { total: number; custom: number; workflow: number };
  model: { total: number; llm: number; embedding: number };
}

export interface MonitorPoint {
  day: string;
  users: number;
  newUsers: number;
  chats: number;
  tokens: number;
  likes: number;
  dislikes: number;
}

export interface RankItem {
  id: string;
  name: string;
  avatar: string;
  subtitle: string;
  value: number;
}

export interface WorkspaceAgentOption {
  value: string;
  label: string;
}

export const defaultAggregation: WorkspaceAggregation = {
  application: { total: 12, published: 9, unpublished: 3 },
  knowledge: { total: 6, documents: 186, failures: 2 },
  tool: { total: 18, custom: 11, workflow: 5 },
  model: { total: 5, llm: 3, embedding: 1 },
};

export const defaultAgentOptions: WorkspaceAgentOption[] = [
  { value: "all", label: "全部智能体" },
  { value: "after-sales", label: "售后问答助手" },
  { value: "sales", label: "销售商机助手" },
  { value: "weekly", label: "周报与会议纪要" },
];

const ranges = [
  { label: "7 天", days: 7 },
  { label: "30 天", days: 30 },
  { label: "90 天", days: 90 },
  { label: "半年", days: 183 },
];

const baseUsers = [38, 46, 41, 57, 63, 34, 29];
const baseNew = [6, 9, 4, 12, 8, 3, 2];
const baseChats = [212, 268, 240, 315, 342, 128, 96];
const baseTokens = [148, 187, 166, 221, 246, 92, 70];
const baseLikes = [18, 24, 21, 30, 33, 11, 8];
const baseDislikes = [2, 3, 1, 4, 2, 1, 0];

function buildPoints(days: number, scale: number): MonitorPoint[] {
  const count = days <= 7 ? 7 : days <= 30 ? 10 : days <= 90 ? 12 : 13;
  const step = Math.max(1, Math.round(days / count));
  const end = new Date(2026, 10, 9);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (count - 1 - index) * step);
    const base = index % 7;
    const growth = 1 + (days > 7 ? index * 0.04 : 0);
    const factor = scale * growth * (days > 7 ? step / 1.6 : 1);
    return {
      day: `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`,
      users: Math.round(baseUsers[base] * factor),
      newUsers: Math.round(baseNew[base] * factor),
      chats: Math.round(baseChats[base] * factor),
      tokens: Math.round(baseTokens[base] * factor) * 100,
      likes: Math.round(baseLikes[base] * factor),
      dislikes: Math.round(baseDislikes[base] * factor),
    };
  });
}

export const defaultTokenRank: RankItem[] = [
  { id: "after-sales", name: "售后问答助手", avatar: "/images/blocks/agents/observatory-robot.webp", subtitle: "对话 1,284 次", value: 412_860 },
  { id: "sales", name: "销售商机助手", avatar: "/images/blocks/agents/fox-4.webp", subtitle: "对话 836 次", value: 298_410 },
  { id: "weekly", name: "周报与会议纪要", avatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp", subtitle: "对话 512 次", value: 186_230 },
  { id: "ops", name: "运维故障分析", avatar: "/images/blocks/agents/lighthouse-lantern-room.webp", subtitle: "对话 304 次", value: 141_920 },
  { id: "contract", name: "合同条款审阅", avatar: "/images/blocks/agents/ink-stamp.webp", subtitle: "对话 168 次", value: 96_480 },
];

export const defaultChatRank: RankItem[] = [
  { id: "after-sales", name: "售后问答助手", avatar: "/images/blocks/agents/observatory-robot.webp", subtitle: "活跃用户 86", value: 1284 },
  { id: "sales", name: "销售商机助手", avatar: "/images/blocks/agents/fox-4.webp", subtitle: "活跃用户 42", value: 836 },
  { id: "weekly", name: "周报与会议纪要", avatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp", subtitle: "活跃用户 37", value: 512 },
  { id: "recruit", name: "招聘初筛", avatar: "/images/blocks/agents/baby-owl.webp", subtitle: "活跃用户 12", value: 326 },
  { id: "ops", name: "运维故障分析", avatar: "/images/blocks/agents/lighthouse-lantern-room.webp", subtitle: "活跃用户 9", value: 304 },
];

export const defaultUserRank: RankItem[] = [
  { id: "lin", name: "林悦", avatar: "/images/blocks/people/lin-yue.jpg", subtitle: "对话 214 次", value: 86_420 },
  { id: "chen", name: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg", subtitle: "对话 186 次", value: 72_310 },
  { id: "xu", name: "许知夏", avatar: "/images/blocks/people/xu-zhixia.jpg", subtitle: "对话 142 次", value: 58_960 },
  { id: "zhou", name: "周远", avatar: "/images/blocks/people/zhou-yuan.jpg", subtitle: "对话 97 次", value: 41_280 },
  { id: "su", name: "苏婉清", avatar: "/images/blocks/people/su-wanqing.jpg", subtitle: "对话 63 次", value: 27_540 },
];

function ChatRoundIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21.8263 13.8655C21.9403 13.2611 22 12.6375 22 12C22 6.47715 17.5228 2 12 2C10.4467 2 8.97611 2.35415 7.66459 2.98611C7.59476 3.01975 7.52539 3.05419 7.45648 3.08939C6.53534 4.50152 6 6.18824 6 8C6 12.9706 10.0294 17 15 17C17.7298 17 20.1758 15.7847 21.8263 13.8655Z" fill="currentColor" opacity={0.5} /><path d="M7.45648 3.08984C4.21754 4.74468 2 8.1136 2 12.0004C2 13.6001 2.37562 15.1121 3.04346 16.4529C3.22094 16.8092 3.28001 17.2165 3.17712 17.6011L2.58151 19.8271C2.32295 20.7934 3.20701 21.6775 4.17335 21.4189L6.39939 20.8233C6.78393 20.7204 7.19121 20.7795 7.54753 20.957C8.88836 21.6248 10.4003 22.0005 12 22.0005C16.8853 22.0005 20.9524 18.4973 21.8263 13.866C20.1758 15.7851 17.7298 17.0004 15 17.0004C10.0294 17.0004 6 12.971 6 8.00045C6 6.18869 6.53534 4.50197 7.45648 3.08984Z" fill="currentColor" /></svg>;
}

function LibraryIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden><path d="M17.8618 4.72266C19.2524 4.72267 20.3924 5.56273 20.7729 6.67676C20.7808 6.69984 20.7892 6.72279 20.7964 6.7461C20.3982 6.62553 19.9834 6.54694 19.564 6.49317C18.4837 6.35469 17.1185 6.35539 15.5327 6.35547H8.64014C7.05435 6.35539 5.68918 6.35472 4.60889 6.49317C4.18946 6.54694 3.77458 6.62555 3.37646 6.7461C3.38366 6.72289 3.39108 6.69975 3.39893 6.67676C3.77945 5.56272 4.92041 4.72266 6.31104 4.72266H17.8618Z" fill="currentColor" /><path d="M15.4897 2C15.7222 1.99995 15.9013 2.00039 16.0571 2.01563C17.1646 2.12414 18.071 2.78961 18.4556 3.68653H5.54443C5.929 2.78944 6.83612 2.12399 7.94385 2.01563C8.09959 2.00041 8.27791 1.99995 8.51025 2H15.4897Z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M8.67239 7.54199H15.3276C18.7024 7.54199 20.3898 7.54199 21.3377 8.52882C22.2855 9.51565 22.0625 11.0403 21.6165 14.0895L21.1935 16.9811C20.8437 19.3723 20.6689 20.5679 19.7717 21.2839C18.8745 21.9999 17.5512 21.9999 14.9046 21.9999H9.09536C6.44881 21.9999 5.12553 21.9999 4.22834 21.2839C3.33115 20.5679 3.15626 19.3723 2.80648 16.9811L2.38351 14.0895C1.93748 11.0403 1.71447 9.51565 2.66232 8.52882C3.61017 7.54199 5.29758 7.54199 8.67239 7.54199ZM8 18.0001C8 17.5859 8.3731 17.2501 8.83333 17.2501H15.1667C15.6269 17.2501 16 17.5859 16 18.0001C16 18.4143 15.6269 18.7501 15.1667 18.7501H8.83333C8.3731 18.7501 8 18.4143 8 18.0001Z" fill="currentColor" /></svg>;
}

function CodeIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden><path d="M14.1816 4.2755C14.5817 4.3827 14.8191 4.79396 14.7119 5.19406L10.7383 20.0238C10.6311 20.4239 10.2198 20.6613 9.81974 20.5541C9.41964 20.4469 9.18221 20.0356 9.28941 19.6355L13.263 4.80583C13.3702 4.40573 13.7815 4.16829 14.1816 4.2755Z" fill="currentColor" opacity={0.5} /><path d="M16.4425 7.32787C16.7196 7.01999 17.1938 6.99503 17.5017 7.27213L19.2392 8.83587C19.9756 9.49853 20.5864 10.0482 21.0058 10.5468C21.4468 11.071 21.7603 11.6343 21.7603 12.3296C21.7603 13.0249 21.4468 13.5882 21.0058 14.1124C20.5864 14.611 19.9756 15.1607 19.2392 15.8233L17.5017 17.3871C17.1938 17.6642 16.7196 17.6392 16.4425 17.3313C16.1654 17.0234 16.1904 16.5492 16.4983 16.2721L18.1947 14.7453C18.9826 14.0362 19.5138 13.5558 19.8579 13.1468C20.1882 12.7542 20.2603 12.525 20.2603 12.3296C20.2603 12.1342 20.1882 11.905 19.8579 11.5124C19.5138 11.1034 18.9826 10.623 18.1947 9.91389L16.4983 8.38707C16.1904 8.10997 16.1654 7.63576 16.4425 7.32787Z" fill="currentColor" /><path d="M7.50178 8.38707C7.80966 8.10997 7.83462 7.63576 7.55752 7.32787C7.28043 7.01999 6.80621 6.99503 6.49833 7.27213L4.76084 8.83587C4.0245 9.49853 3.41369 10.0482 2.99428 10.5468C2.55325 11.071 2.23975 11.6343 2.23975 12.3296C2.23975 13.0249 2.55325 13.5882 2.99428 14.1124C3.41369 14.611 4.02449 15.1607 4.76082 15.8233L6.49833 17.3871C6.80621 17.6642 7.28043 17.6392 7.55752 17.3313C7.83462 17.0234 7.80966 16.5492 7.50178 16.2721L5.80531 14.7453C5.01743 14.0362 4.48623 13.5558 4.14213 13.1468C3.81188 12.7542 3.73975 12.525 3.73975 12.3296C3.73975 12.1342 3.81188 11.905 4.14213 11.5124C4.48623 11.1034 5.01743 10.623 5.80531 9.91389L7.50178 8.38707Z" fill="currentColor" /></svg>;
}

function CpuBoltIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9.18091 9.18091C9.23402 9.1278 9.32886 9.06211 9.63147 9.02143C9.95415 8.97804 10.3921 8.97656 11.0696 8.97656H12.9301C13.6075 8.97656 14.0455 8.97804 14.3682 9.02143C14.6708 9.06211 14.7656 9.1278 14.8187 9.18091C14.8718 9.23402 14.9375 9.32886 14.9782 9.63147C15.0216 9.95415 15.0231 10.3921 15.0231 11.0696V12.9301C15.0231 13.6075 15.0216 14.0455 14.9782 14.3682C14.9375 14.6708 14.8718 14.7656 14.8187 14.8187C14.7656 14.8718 14.6708 14.9375 14.3682 14.9782C14.0455 15.0216 13.6075 15.0231 12.9301 15.0231H11.0696C10.3921 15.0231 9.95415 15.0216 9.63147 14.9782C9.32886 14.9375 9.23402 14.8718 9.18091 14.8187C9.1278 14.7656 9.06211 14.6708 9.02143 14.3682C8.97804 14.0455 8.97656 13.6075 8.97656 12.9301V11.0696C8.97656 10.3921 8.97804 9.95415 9.02143 9.63147C9.06211 9.32886 9.1278 9.23402 9.18091 9.18091Z" fill="currentColor" opacity={0.5} /><path d="M11.8311 9.7334C12.055 9.42015 12.4903 9.34769 12.8037 9.57129C13.1172 9.79524 13.1907 10.2314 12.9668 10.5449L12.4258 11.3018H12.9307C13.1918 11.3019 13.4313 11.4484 13.5508 11.6807C13.6702 11.913 13.6499 12.1927 13.498 12.4053L12.1689 14.2656C11.945 14.5791 11.5088 14.6517 11.1953 14.4277C10.8821 14.2037 10.8093 13.7675 11.0332 13.4541L11.5742 12.6973H11.0693C10.8082 12.6971 10.5687 12.5506 10.4492 12.3184C10.3299 12.0861 10.3502 11.8063 10.502 11.5938L11.8311 9.7334Z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M14.791 2C15.176 2.00017 15.4881 2.31224 15.4883 2.69727V5.48828C15.4883 5.52476 15.4859 5.56073 15.4805 5.5957C16.4163 5.71069 17.0645 5.94925 17.5576 6.44238C18.0508 6.93552 18.2893 7.58367 18.4043 8.51953C18.4393 8.51413 18.4752 8.51172 18.5117 8.51172H21.3027C21.6878 8.51194 21.9998 8.82395 22 9.20898C22 9.59416 21.6879 9.90701 21.3027 9.90723H18.4951C18.5066 10.3286 18.5107 10.7922 18.5117 11.3027H21.3027C21.6879 11.303 22 11.6148 22 12C22 12.3852 21.6879 12.697 21.3027 12.6973H18.5107C18.5097 13.2078 18.5066 13.6714 18.4951 14.0928H21.3027C21.6879 14.093 22 14.4058 22 14.791C21.9998 15.176 21.6878 15.4881 21.3027 15.4883H18.5117C18.4752 15.4883 18.4393 15.4859 18.4043 15.4805C18.2893 16.4163 18.0508 17.0645 17.5576 17.5576C17.0645 18.0508 16.4163 18.2893 15.4805 18.4043C15.4859 18.4393 15.4883 18.4752 15.4883 18.5117V21.3027C15.4881 21.6878 15.176 21.9998 14.791 22C14.4058 22 14.093 21.6879 14.0928 21.3027V18.4951C13.6714 18.5066 13.2078 18.5107 12.6973 18.5117V21.3027C12.697 21.6879 12.3852 22 12 22C11.6148 22 11.303 21.6879 11.3027 21.3027V18.5107C10.7922 18.5097 10.3286 18.5066 9.90723 18.4951V21.3027C9.90701 21.6879 9.59416 22 9.20898 22C8.82395 21.9998 8.51194 21.6878 8.51172 21.3027V18.5117C8.51172 18.4752 8.51413 18.4393 8.51953 18.4043C7.58367 18.2893 6.93552 18.0508 6.44238 17.5576C5.94925 17.0645 5.71069 16.4163 5.5957 15.4805C5.56073 15.4859 5.52476 15.4883 5.48828 15.4883H2.69727C2.31224 15.4881 2.00017 15.176 2 14.791C2 14.4058 2.31214 14.093 2.69727 14.0928H5.50488C5.49336 13.6714 5.48935 13.2078 5.48828 12.6973H2.69727C2.31214 12.697 2 12.3852 2 12C2 11.6148 2.31214 11.303 2.69727 11.3027H5.48926C5.49032 10.7922 5.49336 10.3286 5.50488 9.90723H2.69727C2.31214 9.90701 2 9.59416 2 9.20898C2.00017 8.82395 2.31224 8.51194 2.69727 8.51172H5.48828C5.52476 8.51172 5.56073 8.51413 5.5957 8.51953C5.71069 7.58367 5.94925 6.93552 6.44238 6.44238C6.93552 5.94925 7.58367 5.71069 8.51953 5.5957C8.51413 5.56073 8.51172 5.52476 8.51172 5.48828V2.69727C8.51194 2.31224 8.82395 2.00017 9.20898 2C9.59416 2 9.90701 2.31214 9.90723 2.69727V5.50488C10.3286 5.49336 10.7922 5.48935 11.3027 5.48828V2.69727C11.303 2.31214 11.6148 2 12 2C12.3852 2 12.697 2.31214 12.6973 2.69727V5.48926C13.2078 5.49032 13.6714 5.49336 14.0928 5.50488V2.69727C14.093 2.31214 14.4058 2 14.791 2ZM11.0234 7.58105C10.4051 7.58102 9.87196 7.58131 9.44531 7.63867C8.98812 7.70019 8.54981 7.83886 8.19434 8.19434C7.83886 8.54981 7.70019 8.98812 7.63867 9.44531C7.58131 9.87196 7.58102 10.4051 7.58105 11.0234V12.9766C7.58102 13.5949 7.58131 14.128 7.63867 14.5547C7.70019 15.0119 7.83886 15.4502 8.19434 15.8057C8.54981 16.1611 8.98812 16.2998 9.44531 16.3613C9.87195 16.4187 10.4051 16.419 11.0234 16.4189H12.9766C13.5949 16.419 14.128 16.4187 14.5547 16.3613C15.0119 16.2998 15.4502 16.1611 15.8057 15.8057C16.1611 15.4502 16.2998 15.0119 16.3613 14.5547C16.4187 14.128 16.419 13.5949 16.4189 12.9766V11.0234C16.419 10.4051 16.4187 9.87196 16.3613 9.44531C16.2998 8.98812 16.1611 8.54981 15.8057 8.19434C15.4502 7.83886 15.0119 7.70019 14.5547 7.63867C14.128 7.58131 13.5949 7.58102 12.9766 7.58105H11.0234Z" fill="currentColor" /></svg>;
}

function UserIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden><path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" fill="currentColor" opacity={0.5} /><circle cx="12" cy="6" r="4" fill="currentColor" /></svg>;
}

function LikeIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden><path fillRule="evenodd" clipRule="evenodd" d="M2.96767 9.48508C3.36893 9.46777 3.71261 9.76963 3.74721 10.1698L4.71881 21.4063C4.78122 22.1281 4.21268 22.7502 3.48671 22.7502C2.80289 22.7502 2.25 22.1954 2.25 21.5129V10.2344C2.25 9.83275 2.5664 9.5024 2.96767 9.48508Z" fill="currentColor" opacity={0.5} /><path d="M20.2694 16.265L20.9749 12.1852C21.1511 11.1662 20.3675 10.2342 19.3345 10.2342H14.1534C13.6399 10.2342 13.2489 9.77328 13.332 9.26598L13.9947 5.22142C14.1024 4.56435 14.0716 3.892 13.9044 3.24752C13.7659 2.71364 13.354 2.28495 12.8123 2.11093L12.6673 2.06435C12.3399 1.95918 11.9826 1.98365 11.6739 2.13239C11.3342 2.29611 11.0856 2.59473 10.9935 2.94989L10.5178 4.78374C10.3664 5.36723 10.146 5.93045 9.8617 6.46262C9.44634 7.24017 8.80416 7.86246 8.13663 8.43769L6.69789 9.67749C6.29223 10.0271 6.07919 10.5506 6.12535 11.0844L6.93752 20.4771C7.01201 21.3386 7.73231 22 8.59609 22H13.2447C16.726 22 19.697 19.5744 20.2694 16.265Z" fill="currentColor" /></svg>;
}


/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

const kpiGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:!w-full";

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value || 0);
}

function ratio(part: number, total: number) {
  return total ? Math.min(100, Math.round((part / total) * 100)) : 0;
}

function yAxis(values: number[]): { domain: [number, number]; labels: string[] } {
  const top = Math.max(1, Math.ceil(Math.max(...values)));
  return { domain: [0, top], labels: [formatNumber(top), formatNumber(Math.round(top / 2)), "0"] };
}

function rankBadge(rank: number) {
  if (rank === 1) return "bg-fg-yellow-400 text-fg-black";
  if (rank === 2) return "bg-fg-grey-400 text-white";
  if (rank === 3) return "bg-fg-yellow-700 text-white";
  return "bg-fg-grey-100 text-fg-grey-600";
}

function RankRow({ rank, item, round }: { rank: number; item: RankItem; round?: boolean }) {
  return <div className="flex items-center gap-3 py-2.5">
    <div className="relative shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.avatar} alt="" className={`size-9 object-cover ${round ? "rounded-full" : "rounded-xl"}`} />
      <span className={`absolute -left-1 -top-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${rankBadge(rank)}`}>{rank}</span>
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-fg-black" title={item.name}>{item.name}</p>
      <p className="mt-0.5 truncate text-xs text-fg-grey-500">{item.subtitle}</p>
    </div>
    <p className="shrink-0 text-sm font-semibold tabular-nums text-fg-grey-800">{formatNumber(item.value)}</p>
  </div>;
}

function ChartCard({ title, subtitle, wide, labels, series, legend }: { title: string; subtitle: string; wide?: boolean; labels: string[]; series: { data: number[]; color: string }[]; legend: { label: string; className: string }[] }) {
  const axis = yAxis(series.flatMap(item => item.data));
  return <div className={`flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-background p-6 ${wide ? "lg:col-span-2" : ""}`}>
    <div>
      <h3 className="text-base font-semibold text-fg-black">{title}</h3>
      <p className="text-sm text-fg-grey-500">{subtitle}</p>
    </div>
    <SmoothLineChart accent="blue" height="h-[220px]" showYAxis yDomain={axis.domain} yAxisLabels={axis.labels} xAxisLabels={labels} series={series.map(item => ({ ...item, fillArea: true }))} />
    <div className="flex flex-wrap gap-4 text-xs text-fg-grey-600">
      {legend.map(item => <span key={item.label} className="flex items-center gap-1.5"><span className={`size-2 rounded-full ${item.className}`} /> {item.label}</span>)}
    </div>
  </div>;
}

function RankCard({ title, subtitle, items, round }: { title: string; subtitle: string; items: RankItem[]; round?: boolean }) {
  return <ListGroup
    title={title}
    subtitle={subtitle}
    color="blue"
    action={<KebabMenu accent="blue" items={[{ label: "查看完整榜单" }, { label: "导出 Excel" }]} />}
    items={items.length
      ? <div className="flex flex-col divide-y divide-fg-grey-100">{items.map((item, index) => <RankRow key={item.id} rank={index + 1} item={item} round={round} />)}</div>
      : <p className="py-6 text-center text-sm text-fg-grey-500">暂无数据</p>}
  />;
}

export interface AiWorkspaceOverviewProps {
  aggregation?: WorkspaceAggregation;
  agents?: WorkspaceAgentOption[];
  tokenRank?: RankItem[];
  chatRank?: RankItem[];
  userRank?: RankItem[];
  className?: string;
}

export function AiWorkspaceOverview({
  aggregation = defaultAggregation,
  agents = defaultAgentOptions,
  tokenRank = defaultTokenRank,
  chatRank = defaultChatRank,
  userRank = defaultUserRank,
  className = "",
}: AiWorkspaceOverviewProps) {
  const [rangeIndex, setRangeIndex] = useState(0);
  const [agentId, setAgentId] = useState("all");
  const range = ranges[rangeIndex];
  const points = useMemo(() => buildPoints(range.days, agentId === "all" ? 1 : 0.35 + (agents.findIndex(agent => agent.value === agentId) % 3) * 0.1), [range.days, agentId, agents]);
  const labels = points.map(point => point.day);
  const series = (key: keyof Omit<MonitorPoint, "day">) => points.map(point => point[key]);
  const totals = points.reduce((sum, point) => ({ users: Math.max(sum.users, point.users), newUsers: sum.newUsers + point.newUsers, chats: sum.chats + point.chats, tokens: sum.tokens + point.tokens, likes: sum.likes + point.likes, dislikes: sum.dislikes + point.dislikes }), { users: 0, newUsers: 0, chats: 0, tokens: 0, likes: 0, dislikes: 0 });
  const { application, knowledge, tool, model } = aggregation;
  const resourceIcon = (icon: ReactNode) => <span className="text-white">{icon}</span>;

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-6 ${className}`}>
    <PageTitleToolbar
      title="工作台"
      breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "工作台" }]} />}
      askAi={{ placeholder: "问问工作台的数据…", suggestions: ["本周哪个智能体最活跃？", "Tokens 消耗为什么上涨？"], onSend: () => "本周对话量最高的是「售后问答助手」，占全部对话的 38%。Tokens 上涨主要来自周四、周五的退换货咨询高峰。" }}
      actions={<div className="flex flex-wrap items-center gap-2">
        <KebabMenu accent="blue" items={[{ label: "简单 Agent" }, { label: "高级工作流" }, { label: "通用知识库" }, { label: "Web 知识库" }, { label: "添加工具" }, { label: "添加模型" }]} />
        <Button color="blue" iconLeft={<PlusIcon size={16} />}>新建应用智能体</Button>
      </div>}
      className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0 [&>div:first-child]:sm:min-w-48 [&>div:last-child]:sm:flex-wrap"
    />

    <div className={kpiGrid}>
      <ProgressStatCard title="应用智能体" value={formatNumber(application.total)} trend={`${ratio(application.published, application.total)}%`} trendDirection={application.published >= application.unpublished ? "up" : "down"} subtitle={`已发布 ${application.published} · 未发布 ${application.unpublished}`} theme="white" size="wide" width="full" progressValue={ratio(application.published, application.total)} progressColor="blue" icon={resourceIcon(<ChatRoundIcon />)} />
      <ProgressStatCard title="知识库" value={formatNumber(knowledge.total)} trend={knowledge.failures ? `${knowledge.failures} 失败` : "健康"} trendDirection={knowledge.failures ? "down" : "up"} subtitle={`文档 ${knowledge.documents} · 失败 ${knowledge.failures}`} theme="white" size="wide" width="full" progressValue={knowledge.documents ? 100 - Math.round((knowledge.failures / knowledge.documents) * 100) : 0} progressColor="purple" icon={resourceIcon(<LibraryIcon />)} />
      <ProgressStatCard title="工具" value={formatNumber(tool.total)} trend={`${tool.custom} 自定义`} trendDirection="up" subtitle={`工具 ${tool.custom} · 工作流 ${tool.workflow} · 其他 ${Math.max(0, tool.total - tool.custom - tool.workflow)}`} theme="white" size="wide" width="full" progressValue={ratio(tool.custom, tool.total)} progressColor="green" icon={resourceIcon(<CodeIcon />)} />
      <ProgressStatCard title="模型" value={formatNumber(model.total)} trend={`${model.llm} 大语言`} trendDirection="up" subtitle={`大语言 ${model.llm} · 向量 ${model.embedding} · 其他 ${Math.max(0, model.total - model.llm - model.embedding)}`} theme="white" size="wide" width="full" progressValue={ratio(model.llm, model.total)} progressColor="cyan" icon={resourceIcon(<CpuBoltIcon />)} />
    </div>

    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fg-black">监控统计</h2>
          <p className="text-sm text-fg-grey-500">活跃用户、对话、Tokens 与满意度</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-12 items-center">
            <ButtonGroup items={ranges.map(item => ({ label: item.label }))} activeIndex={rangeIndex} color="blue" shape="pill" onChange={setRangeIndex} ariaLabel="统计时间范围" />
          </div>
          <SelectOption color="blue" width="200px" placeholder="全部智能体" value={agentId} options={agents} onChange={setAgentId} className="!gap-0" />
        </div>
      </div>
      <div className={kpiGrid}>
        <LineChartStatCard title="活跃用户" value={formatNumber(totals.users)} trend={`+${formatNumber(totals.newUsers)}`} trendDirection="up" subtitle="新增" theme="white" size="wide" width="full" chartColor="blue" series={series("users")} icon={resourceIcon(<UserIcon />)} />
        <LineChartStatCard title="对话次数" value={formatNumber(totals.chats)} trend="记录" trendDirection="up" subtitle="对话" theme="white" size="wide" width="full" chartColor="orange" series={series("chats")} icon={resourceIcon(<ChatRoundIcon />)} />
        <LineChartStatCard title="Tokens 总数" value={formatNumber(totals.tokens)} trend="Token" trendDirection="up" subtitle="消耗" theme="white" size="wide" width="full" chartColor="cyan" series={series("tokens")} icon={resourceIcon(<CpuBoltIcon />)} />
        <LineChartStatCard title="用户满意度" value={`${formatNumber(totals.likes)} / ${formatNumber(totals.dislikes)}`} trend={totals.likes >= totals.dislikes ? "偏赞" : "偏踩"} trendDirection={totals.likes >= totals.dislikes ? "up" : "down"} subtitle="赞 / 踩" theme="white" size="wide" width="full" chartColor="green" series={series("likes")} icon={resourceIcon(<LikeIcon />)} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="用户趋势" subtitle="活跃用户与新增用户" labels={labels} series={[{ data: series("users"), color: "var(--fg-blue)" }, { data: series("newUsers"), color: "var(--fg-cyan-500)" }]} legend={[{ label: "活跃用户", className: "bg-fg-blue" }, { label: "新增用户", className: "bg-fg-cyan-500" }]} />
        <ChartCard title="对话与 Tokens" subtitle="对话次数与 Tokens 消耗（百）" labels={labels} series={[{ data: series("chats"), color: "var(--fg-yellow)" }, { data: series("tokens").map(value => Math.round(value / 100)), color: "var(--fg-cyan-500)" }]} legend={[{ label: "对话次数", className: "bg-fg-yellow" }, { label: "Tokens", className: "bg-fg-cyan-500" }]} />
        <ChartCard wide title="用户满意度" subtitle="赞同与反对反馈" labels={labels} series={[{ data: series("likes"), color: "var(--fg-green-500)" }, { data: series("dislikes"), color: "var(--fg-red)" }]} legend={[{ label: "赞同", className: "bg-fg-green-500" }, { label: "反对", className: "bg-fg-red" }]} />
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-fg-black">排行榜 TOP5</h2>
        <p className="text-sm text-fg-grey-500">与监控统计使用同一时间范围</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RankCard title="Tokens 消耗" subtitle="应用智能体" items={tokenRank} />
        <RankCard title="对话次数" subtitle="应用智能体" items={chatRank} />
        <RankCard title="Tokens 消耗" subtitle="用户" items={userRank} round />
      </div>
    </div>
  </div>;
}
