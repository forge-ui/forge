import { forwardRef } from "react";
import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react";
import {
  ArrowBendUpLeftIcon,
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  ArrowsDownUpIcon,
  ArrowsLeftRightIcon,
  BagIcon,
  BellIcon,
  BookOpenIcon,
  BookmarkSimpleIcon,
  CalendarBlankIcon,
  CalendarDotsIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  ChartBarIcon,
  ChartLineUpIcon,
  ChartPieSliceIcon,
  ChatCircleIcon,
  ChatCircleDotsIcon,
  ChatDotsIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  ClockIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  ContactlessPaymentIcon,
  CopyIcon,
  CreditCardIcon,
  CrownIcon,
  CubeIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  EnvelopeIcon,
  EyeIcon,
  FileIcon,
  FileTextIcon,
  FlagIcon,
  FolderIcon,
  FolderOpenIcon,
  FoldersIcon,
  FunnelIcon,
  GameControllerIcon,
  GearSixIcon,
  HashIcon,
  HeartIcon,
  HouseIcon,
  HouseLineIcon,
  InfoIcon,
  KeyboardIcon,
  LinkIcon,
  ListIcon,
  ListChecksIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  MailboxIcon,
  MapPinIcon,
  MinusSquareIcon,
  MoneyIcon,
  MouseIcon,
  NotePencilIcon,
  PaperPlaneTiltIcon,
  PaperclipIcon,
  PasswordIcon,
  PencilIcon,
  PencilSimpleIcon,
  PhoneIcon,
  PhoneCallIcon,
  PlayIcon,
  PlayCircleIcon,
  PlusIcon,
  PlusCircleIcon,
  PlusSquareIcon,
  PrinterIcon,
  PushPinIcon,
  QuestionIcon,
  ReceiptIcon,
  RecordIcon,
  RocketIcon,
  RocketLaunchIcon,
  ShareNetworkIcon,
  ShieldIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  ShoppingCartSimpleIcon,
  SignInIcon,
  SignOutIcon,
  SlidersHorizontalIcon,
  SortDescendingIcon,
  SparkleIcon,
  SquaresFourIcon,
  StarIcon,
  StorefrontIcon,
  TagIcon,
  TargetIcon,
  TicketIcon,
  TrashIcon,
  TrashSimpleIcon,
  TrayIcon,
  UserIcon,
  UserCheckIcon,
  UserPlusIcon,
  UsersIcon,
  UsersThreeIcon,
  VideoCameraIcon,
  WalletIcon,
  WarningIcon,
  WarningCircleIcon,
  WarningOctagonIcon,
  XCircleIcon,
  XSquareIcon,
} from "@phosphor-icons/react/ssr";

export type ForgeIconProps = IconProps;

function createForgeIcon(
  Source: Icon,
  defaultWeight: IconWeight,
  displayName: string,
): Icon {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        color = "currentColor",
        size = 16,
        style,
        weight = defaultWeight,
        ...props
      },
      ref,
    ) => (
      <Source
        ref={ref}
        color={color}
        size={size}
        style={{ display: "inline-block", ...style }}
        weight={weight}
        {...props}
      />
    ),
  );
  Component.displayName = displayName;
  return Component;
}

// These stable Forge names preserve the existing component API while the
// implementation is backed entirely by the MIT-licensed Phosphor icon set.
export const AddCircleBoldDuotone = createForgeIcon(PlusCircleIcon, "duotone", "AddCircleBoldDuotone");
export const AddCircleBold = createForgeIcon(PlusCircleIcon, "fill", "AddCircleBold");
export const AddCircleLinear = createForgeIcon(PlusCircleIcon, "regular", "AddCircleLinear");
export const AddSquareLinear = createForgeIcon(PlusSquareIcon, "regular", "AddSquareLinear");
export const AltArrowDownBold = createForgeIcon(CaretDownIcon, "fill", "AltArrowDownBold");
export const AltArrowDownLinear = createForgeIcon(CaretDownIcon, "regular", "AltArrowDownLinear");
export const AltArrowLeftLinear = createForgeIcon(CaretLeftIcon, "regular", "AltArrowLeftLinear");
export const AltArrowRightLinear = createForgeIcon(CaretRightIcon, "regular", "AltArrowRightLinear");
export const AltArrowUpBold = createForgeIcon(CaretUpIcon, "fill", "AltArrowUpBold");
export const AltArrowUpLinear = createForgeIcon(CaretUpIcon, "regular", "AltArrowUpLinear");
export const ArrowLeftLinear = createForgeIcon(ArrowLeftIcon, "regular", "ArrowLeftLinear");
export const ArrowRightDownLinear = createForgeIcon(ArrowDownRightIcon, "regular", "ArrowRightDownLinear");
export const ArrowRightLinear = createForgeIcon(ArrowRightIcon, "regular", "ArrowRightLinear");
export const ArrowRightUpLinear = createForgeIcon(ArrowUpRightIcon, "regular", "ArrowRightUpLinear");
export const ArrowUpLinear = createForgeIcon(ArrowUpIcon, "regular", "ArrowUpLinear");
export const BagBoldDuotone = createForgeIcon(BagIcon, "duotone", "BagBoldDuotone");
export const BellBold = createForgeIcon(BellIcon, "fill", "BellBold");
export const BellBoldDuotone = createForgeIcon(BellIcon, "duotone", "BellBoldDuotone");
export const BellLinear = createForgeIcon(BellIcon, "regular", "BellLinear");
export const BillCheckBoldDuotone = createForgeIcon(ReceiptIcon, "duotone", "BillCheckBoldDuotone");
export const BillListBoldDuotone = createForgeIcon(ReceiptIcon, "duotone", "BillListBoldDuotone");
export const BookBoldDuotone = createForgeIcon(BookOpenIcon, "duotone", "BookBoldDuotone");
export const BookmarkLinear = createForgeIcon(BookmarkSimpleIcon, "regular", "BookmarkLinear");
export const BoxBoldDuotone = createForgeIcon(CubeIcon, "duotone", "BoxBoldDuotone");
export const CalendarBoldDuotone = createForgeIcon(CalendarBlankIcon, "duotone", "CalendarBoldDuotone");
export const CalendarBold = createForgeIcon(CalendarBlankIcon, "fill", "CalendarBold");
export const CalendarLinear = createForgeIcon(CalendarBlankIcon, "regular", "CalendarLinear");
export const CalendarMinimalisticLinear = createForgeIcon(CalendarDotsIcon, "regular", "CalendarMinimalisticLinear");
export const CardBold = createForgeIcon(CreditCardIcon, "fill", "CardBold");
export const CardBoldDuotone = createForgeIcon(CreditCardIcon, "duotone", "CardBoldDuotone");
export const CardSendBoldDuotone = createForgeIcon(ContactlessPaymentIcon, "duotone", "CardSendBoldDuotone");
export const CartBoldDuotone = createForgeIcon(ShoppingCartIcon, "duotone", "CartBoldDuotone");
export const CartLargeBoldDuotone = createForgeIcon(ShoppingCartSimpleIcon, "duotone", "CartLargeBoldDuotone");
export const CartPlusLinear = createForgeIcon(ShoppingCartIcon, "regular", "CartPlusLinear");
export const ChartBoldDuotone = createForgeIcon(ChartLineUpIcon, "duotone", "ChartBoldDuotone");
export const ChartSquareBoldDuotone = createForgeIcon(ChartBarIcon, "duotone", "ChartSquareBoldDuotone");
export const ChartSquareLinear = createForgeIcon(ChartBarIcon, "regular", "ChartSquareLinear");
export const ChatDotsLinear = createForgeIcon(ChatDotsIcon, "regular", "ChatDotsLinear");
export const ChatRoundLineLinear = createForgeIcon(ChatCircleDotsIcon, "regular", "ChatRoundLineLinear");
export const ChatRoundLinear = createForgeIcon(ChatCircleIcon, "regular", "ChatRoundLinear");
export const CheckCircleBold = createForgeIcon(CheckCircleIcon, "fill", "CheckCircleBold");
export const CheckCircleBoldDuotone = createForgeIcon(CheckCircleIcon, "duotone", "CheckCircleBoldDuotone");
export const CheckCircleLinear = createForgeIcon(CheckCircleIcon, "regular", "CheckCircleLinear");
export const ClipboardListBoldDuotone = createForgeIcon(ClipboardTextIcon, "duotone", "ClipboardListBoldDuotone");
export const ClockCircleBoldDuotone = createForgeIcon(ClockIcon, "duotone", "ClockCircleBoldDuotone");
export const ClockCircleLinear = createForgeIcon(ClockIcon, "regular", "ClockCircleLinear");
export const CloseCircleBoldDuotone = createForgeIcon(XCircleIcon, "duotone", "CloseCircleBoldDuotone");
export const CloseCircleLinear = createForgeIcon(XCircleIcon, "regular", "CloseCircleLinear");
export const CloseSquareLinear = createForgeIcon(XSquareIcon, "regular", "CloseSquareLinear");
export const CloudDownloadLinear = createForgeIcon(CloudArrowDownIcon, "regular", "CloudDownloadLinear");
export const CloudUploadLinear = createForgeIcon(CloudArrowUpIcon, "regular", "CloudUploadLinear");
export const CopyBoldDuotone = createForgeIcon(CopyIcon, "duotone", "CopyBoldDuotone");
export const CopyLinear = createForgeIcon(CopyIcon, "regular", "CopyLinear");
export const CrownBold = createForgeIcon(CrownIcon, "fill", "CrownBold");
export const DangerBold = createForgeIcon(WarningOctagonIcon, "fill", "DangerBold");
export const DangerCircleBoldDuotone = createForgeIcon(WarningCircleIcon, "duotone", "DangerCircleBoldDuotone");
export const DangerTriangleBold = createForgeIcon(WarningIcon, "fill", "DangerTriangleBold");
export const DangerTriangleLinear = createForgeIcon(WarningIcon, "regular", "DangerTriangleLinear");
export const DocumentBoldDuotone = createForgeIcon(FileIcon, "duotone", "DocumentBoldDuotone");
export const DocumentTextBoldDuotone = createForgeIcon(FileTextIcon, "duotone", "DocumentTextBoldDuotone");
export const DocumentTextLinear = createForgeIcon(FileTextIcon, "regular", "DocumentTextLinear");
export const DownloadLinear = createForgeIcon(DownloadSimpleIcon, "regular", "DownloadLinear");
export const DownloadMinimalisticLinear = createForgeIcon(DownloadSimpleIcon, "regular", "DownloadMinimalisticLinear");
export const EyeBoldDuotone = createForgeIcon(EyeIcon, "duotone", "EyeBoldDuotone");
export const EyeLinear = createForgeIcon(EyeIcon, "regular", "EyeLinear");
export const FileTextBoldDuotone = createForgeIcon(FileTextIcon, "duotone", "FileTextBoldDuotone");
export const FileTextLinear = createForgeIcon(FileTextIcon, "regular", "FileTextLinear");
export const FilterBold = createForgeIcon(FunnelIcon, "fill", "FilterBold");
export const FilterLinear = createForgeIcon(FunnelIcon, "regular", "FilterLinear");
export const FiltersLinear = createForgeIcon(SlidersHorizontalIcon, "regular", "FiltersLinear");
export const FlagLinear = createForgeIcon(FlagIcon, "regular", "FlagLinear");
export const FolderBoldDuotone = createForgeIcon(FolderIcon, "duotone", "FolderBoldDuotone");
export const FolderOpenLinear = createForgeIcon(FolderOpenIcon, "regular", "FolderOpenLinear");
export const FolderWithFilesBoldDuotone = createForgeIcon(FoldersIcon, "duotone", "FolderWithFilesBoldDuotone");
export const GameboyBoldDuotone = createForgeIcon(GameControllerIcon, "duotone", "GameboyBoldDuotone");
export const HamburgerMenuLinear = createForgeIcon(ListIcon, "regular", "HamburgerMenuLinear");
export const HashtagBoldDuotone = createForgeIcon(HashIcon, "duotone", "HashtagBoldDuotone");
export const HeartBoldDuotone = createForgeIcon(HeartIcon, "duotone", "HeartBoldDuotone");
export const HeartLinear = createForgeIcon(HeartIcon, "regular", "HeartLinear");
export const HomeBoldDuotone = createForgeIcon(HouseIcon, "duotone", "HomeBoldDuotone");
export const HomeLinear = createForgeIcon(HouseIcon, "regular", "HomeLinear");
export const HomeSmileBoldDuotone = createForgeIcon(HouseLineIcon, "duotone", "HomeSmileBoldDuotone");
export const InboxBoldDuotone = createForgeIcon(TrayIcon, "duotone", "InboxBoldDuotone");
export const InfoCircleBoldDuotone = createForgeIcon(InfoIcon, "duotone", "InfoCircleBoldDuotone");
export const KeyboardBoldDuotone = createForgeIcon(KeyboardIcon, "duotone", "KeyboardBoldDuotone");
export const LetterBoldDuotone = createForgeIcon(EnvelopeIcon, "duotone", "LetterBoldDuotone");
export const LetterBold = createForgeIcon(EnvelopeIcon, "fill", "LetterBold");
export const LetterLinear = createForgeIcon(EnvelopeIcon, "regular", "LetterLinear");
export const LinkRoundAngleLinear = createForgeIcon(LinkIcon, "regular", "LinkRoundAngleLinear");
export const ListCheckLinear = createForgeIcon(ListChecksIcon, "regular", "ListCheckLinear");
export const LockKeyholeLinear = createForgeIcon(LockKeyIcon, "regular", "LockKeyholeLinear");
export const LockPasswordBoldDuotone = createForgeIcon(PasswordIcon, "duotone", "LockPasswordBoldDuotone");
export const LockPasswordBold = createForgeIcon(PasswordIcon, "fill", "LockPasswordBold");
export const Login2Linear = createForgeIcon(SignInIcon, "regular", "Login2Linear");
export const Logout2BoldDuotone = createForgeIcon(SignOutIcon, "duotone", "Logout2BoldDuotone");
export const Logout2Bold = createForgeIcon(SignOutIcon, "fill", "Logout2Bold");
export const Logout3BoldDuotone = createForgeIcon(SignOutIcon, "duotone", "Logout3BoldDuotone");
export const Logout3Linear = createForgeIcon(SignOutIcon, "regular", "Logout3Linear");
export const MagniferBoldDuotone = createForgeIcon(MagnifyingGlassIcon, "duotone", "MagniferBoldDuotone");
export const MagniferLinear = createForgeIcon(MagnifyingGlassIcon, "regular", "MagniferLinear");
export const MailboxLinear = createForgeIcon(MailboxIcon, "regular", "MailboxLinear");
export const MapPointBoldDuotone = createForgeIcon(MapPinIcon, "duotone", "MapPointBoldDuotone");
export const MenuDotsBold = createForgeIcon(DotsThreeIcon, "fill", "MenuDotsBold");
export const MenuDotsLinear = createForgeIcon(DotsThreeIcon, "regular", "MenuDotsLinear");
export const MinusSquareLinear = createForgeIcon(MinusSquareIcon, "regular", "MinusSquareLinear");
export const MouseBoldDuotone = createForgeIcon(MouseIcon, "duotone", "MouseBoldDuotone");
export const PaperclipLinear = createForgeIcon(PaperclipIcon, "regular", "PaperclipLinear");
export const Pen2Linear = createForgeIcon(PencilIcon, "regular", "Pen2Linear");
export const PenBoldDuotone = createForgeIcon(PencilSimpleIcon, "duotone", "PenBoldDuotone");
export const PenBold = createForgeIcon(PencilSimpleIcon, "fill", "PenBold");
export const PenLinear = createForgeIcon(PencilSimpleIcon, "regular", "PenLinear");
export const PenNewSquareBoldDuotone = createForgeIcon(NotePencilIcon, "duotone", "PenNewSquareBoldDuotone");
export const PenNewSquareLinear = createForgeIcon(NotePencilIcon, "regular", "PenNewSquareLinear");
export const PhoneBoldDuotone = createForgeIcon(PhoneIcon, "duotone", "PhoneBoldDuotone");
export const PhoneCallingLinear = createForgeIcon(PhoneCallIcon, "regular", "PhoneCallingLinear");
export const PhoneCallingRoundedLinear = createForgeIcon(PhoneCallIcon, "regular", "PhoneCallingRoundedLinear");
export const PhoneLinear = createForgeIcon(PhoneIcon, "regular", "PhoneLinear");
export const PieChart3BoldDuotone = createForgeIcon(ChartPieSliceIcon, "duotone", "PieChart3BoldDuotone");
export const PinLinear = createForgeIcon(PushPinIcon, "regular", "PinLinear");
export const PlainBold = createForgeIcon(PaperPlaneTiltIcon, "fill", "PlainBold");
export const PlainLinear = createForgeIcon(PaperPlaneTiltIcon, "regular", "PlainLinear");
export const PlayBoldDuotone = createForgeIcon(PlayIcon, "duotone", "PlayBoldDuotone");
export const PlayCircleBold = createForgeIcon(PlayCircleIcon, "fill", "PlayCircleBold");
export const PlusLinear = createForgeIcon(PlusIcon, "regular", "PlusLinear");
export const PrinterLinear = createForgeIcon(PrinterIcon, "regular", "PrinterLinear");
export const QuestionCircleBoldDuotone = createForgeIcon(QuestionIcon, "duotone", "QuestionCircleBoldDuotone");
export const RefreshLinear = createForgeIcon(ArrowClockwiseIcon, "regular", "RefreshLinear");
export const ReplyLinear = createForgeIcon(ArrowBendUpLeftIcon, "regular", "ReplyLinear");
export const RestartCircleLinear = createForgeIcon(ArrowCounterClockwiseIcon, "regular", "RestartCircleLinear");
export const Rocket2Bold = createForgeIcon(RocketIcon, "fill", "Rocket2Bold");
export const RocketBold = createForgeIcon(RocketLaunchIcon, "fill", "RocketBold");
export const RoundTransferHorizontalLinear = createForgeIcon(ArrowsLeftRightIcon, "regular", "RoundTransferHorizontalLinear");
export const SettingsBoldDuotone = createForgeIcon(GearSixIcon, "duotone", "SettingsBoldDuotone");
export const SettingsBold = createForgeIcon(GearSixIcon, "fill", "SettingsBold");
export const ShareLinear = createForgeIcon(ShareNetworkIcon, "regular", "ShareLinear");
export const ShieldCheckBold = createForgeIcon(ShieldCheckIcon, "fill", "ShieldCheckBold");
export const ShieldUpBold = createForgeIcon(ShieldIcon, "fill", "ShieldUpBold");
export const ShopBoldDuotone = createForgeIcon(StorefrontIcon, "duotone", "ShopBoldDuotone");
export const SortFromTopToBottomBold = createForgeIcon(SortDescendingIcon, "fill", "SortFromTopToBottomBold");
export const StarBold = createForgeIcon(StarIcon, "fill", "StarBold");
export const StarBoldDuotone = createForgeIcon(StarIcon, "duotone", "StarBoldDuotone");
export const StarLinear = createForgeIcon(StarIcon, "regular", "StarLinear");
export const StarsBold = createForgeIcon(SparkleIcon, "fill", "StarsBold");
export const TagBoldDuotone = createForgeIcon(TagIcon, "duotone", "TagBoldDuotone");
export const TagLinear = createForgeIcon(TagIcon, "regular", "TagLinear");
export const TargetBold = createForgeIcon(TargetIcon, "fill", "TargetBold");
export const TickerStarBoldDuotone = createForgeIcon(TicketIcon, "duotone", "TickerStarBoldDuotone");
export const TransferHorizontalBoldDuotone = createForgeIcon(ArrowsLeftRightIcon, "duotone", "TransferHorizontalBoldDuotone");
export const TransferVerticalLinear = createForgeIcon(ArrowsDownUpIcon, "regular", "TransferVerticalLinear");
export const TrashBinMinimalisticBold = createForgeIcon(TrashSimpleIcon, "fill", "TrashBinMinimalisticBold");
export const TrashBinMinimalisticLinear = createForgeIcon(TrashSimpleIcon, "regular", "TrashBinMinimalisticLinear");
export const TrashBinTrashBoldDuotone = createForgeIcon(TrashIcon, "duotone", "TrashBinTrashBoldDuotone");
export const TrashBinTrashLinear = createForgeIcon(TrashIcon, "regular", "TrashBinTrashLinear");
export const UserBoldDuotone = createForgeIcon(UserIcon, "duotone", "UserBoldDuotone");
export const UserCheckLinear = createForgeIcon(UserCheckIcon, "regular", "UserCheckLinear");
export const UserLinear = createForgeIcon(UserIcon, "regular", "UserLinear");
export const UserPlusBoldDuotone = createForgeIcon(UserPlusIcon, "duotone", "UserPlusBoldDuotone");
export const UserPlusBold = createForgeIcon(UserPlusIcon, "fill", "UserPlusBold");
export const UserPlusLinear = createForgeIcon(UserPlusIcon, "regular", "UserPlusLinear");
export const UsersGroupRoundedBoldDuotone = createForgeIcon(UsersIcon, "duotone", "UsersGroupRoundedBoldDuotone");
export const UsersGroupRoundedLinear = createForgeIcon(UsersIcon, "regular", "UsersGroupRoundedLinear");
export const UsersGroupTwoRoundedBoldDuotone = createForgeIcon(UsersThreeIcon, "duotone", "UsersGroupTwoRoundedBoldDuotone");
export const VideocameraBoldDuotone = createForgeIcon(VideoCameraIcon, "duotone", "VideocameraBoldDuotone");
export const VideocameraRecordLinear = createForgeIcon(RecordIcon, "regular", "VideocameraRecordLinear");
export const WalletBoldDuotone = createForgeIcon(WalletIcon, "duotone", "WalletBoldDuotone");
export const WalletLinear = createForgeIcon(WalletIcon, "regular", "WalletLinear");
export const WalletMoneyBoldDuotone = createForgeIcon(MoneyIcon, "duotone", "WalletMoneyBoldDuotone");
export const WalletMoneyLinear = createForgeIcon(MoneyIcon, "regular", "WalletMoneyLinear");
export const WidgetBoldDuotone = createForgeIcon(SquaresFourIcon, "duotone", "WidgetBoldDuotone");
