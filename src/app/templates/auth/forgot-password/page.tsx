/* eslint-disable @next/next/no-img-element */

import { HeartBold } from "solar-icon-set";
import { asset } from "@/lib/asset";

const imgImage = asset("/images/hero.jpg");
const img4ColUpsideDownBar = asset("/images/chart-card.png");
const imgLargeBadgeImgStatisticCard = asset("/images/stat-card.png");

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white content-stretch flex flex-col isolate items-start p-[24px] relative w-full min-h-screen">
      <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-h-px min-w-px relative w-full z-[1]">
        {/* Left Image Panel */}
        <div className="h-full overflow-clip relative rounded-2xl shrink-0 w-[640px]">
          <div className="absolute h-[912px] left-0 rounded-xs top-0 w-[640px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xs">
              <img alt="" className="absolute h-full left-[-92.47%] max-w-none top-0 w-[276.47%]" src={imgImage} />
            </div>
          </div>
          <div className="absolute h-[246px] right-[32px] top-[528px] w-[228px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img4ColUpsideDownBar} />
          </div>
          <div className="absolute h-[156px] left-[32px] top-[696px] w-[240px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLargeBadgeImgStatisticCard} />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] h-full items-center justify-center min-h-px min-w-px relative rounded-2xl">
          <div className="content-stretch flex flex-col gap-[32px] items-center justify-center relative shrink-0">
            {/* Header */}
            <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 text-center w-[400px]">
              <p className="font-semibold leading-8 relative shrink-0 text-fg-black text-2xl tracking-fg w-full">
                Forgot Password
              </p>
              <p className="font-normal leading-6 relative shrink-0 text-fg-grey-700 text-base tracking-fg w-full">
                Enter the email address you used when joined and we&apos;ll send reset instructions to reset your password.
              </p>
            </div>

            {/* Form */}
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[400px]">
              {/* Email */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-medium leading-5 min-h-px min-w-px relative text-fg-grey-700 text-sm tracking-fg">
                    Email
                  </p>
                </div>
                <input
                  type="email"
                  placeholder="Your email. . ."
                  className="bg-white border border-fg-grey-100 border-solid overflow-clip px-[16px] py-[12px] rounded-full shrink-0 w-full font-normal leading-5 text-fg-black text-sm tracking-fg placeholder:text-fg-grey-700 focus:outline-fg-violet focus:outline-1"
                />
              </div>

              {/* Submit Button */}
              <button className="bg-fg-violet content-stretch flex items-center justify-center overflow-clip px-[16px] py-[14px] relative rounded-full shrink-0 w-full cursor-pointer hover:opacity-90 transition-opacity">
                <span className="font-bold leading-5 text-sm text-white tracking-fg whitespace-nowrap">
                  Send Reset Instructions
                </span>
              </button>
            </div>

            {/* Back Link */}
            <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-[400px]">
              <p className="font-normal leading-5 relative shrink-0 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
                Back to log in page?
              </p>
              <a href="/templates/auth/sign-in" className="font-bold leading-5 relative shrink-0 text-fg-violet text-sm tracking-fg whitespace-nowrap hover:underline">
                Back now
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="-translate-x-1/2 absolute bottom-[24px] content-stretch flex gap-[4px] items-center left-1/2">
            <p className="font-normal leading-5 relative shrink-0 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
              © 2024 Made With
            </p>
            <HeartBold size={14} color="#FE4A23" />
            <p className="font-normal leading-5 relative shrink-0 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
              By Sugab
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
