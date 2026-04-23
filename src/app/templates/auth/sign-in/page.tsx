"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { EyeLinear, EyeClosedLinear, HeartBold } from "solar-icon-set";
import { asset } from "@/lib/asset";

const imgImage = asset("/images/hero.jpg");
const img4ColUpsideDownBar = asset("/images/chart-card.png");
const imgLargeBadgeImgStatisticCard = asset("/images/stat-card.png");

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
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
          {/* Copyright */}
          <div className="-translate-x-1/2 absolute bottom-[24px] content-stretch flex gap-[4px] items-center left-1/2">
            <p className="font-normal leading-5 relative shrink-0 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
              © 2024 Made With
            </p>
            <HeartBold size={14} color="#EF4444" />
            <p className="font-normal leading-5 relative shrink-0 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
              By Sugab
            </p>
          </div>

          <div className="content-stretch flex flex-col gap-[32px] items-center justify-center relative shrink-0">
            {/* Header */}
            <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 text-center w-[400px]">
              <p className="font-semibold leading-8 relative shrink-0 text-fg-black text-2xl tracking-fg w-full">
                Welcome Back!
              </p>
              <p className="font-normal leading-6 relative shrink-0 text-fg-grey-700 text-base tracking-fg w-full">
                Welcome back, please enter your details.
              </p>
            </div>

            {/* Social Login */}
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[400px]">
              {/* Google */}
              <button className="border border-fg-grey-200 border-solid content-stretch flex gap-[8px] items-center justify-center overflow-clip pl-[14px] pr-[16px] py-[14px] relative rounded-full shrink-0 w-full cursor-pointer hover:bg-gray-50 transition-colors">
                <img alt="" src={asset("/images/brands/google.svg")} className="size-[20px] shrink-0" />
                <span className="font-bold leading-5 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
                  Log in with Google
                </span>
              </button>

              {/* Facebook */}
              <button className="border border-fg-grey-200 border-solid content-stretch flex gap-[8px] items-center justify-center overflow-clip pl-[14px] pr-[16px] py-[14px] relative rounded-full shrink-0 w-full cursor-pointer hover:bg-gray-50 transition-colors">
                <img alt="" src={asset("/images/brands/facebook.svg")} className="size-[20px] shrink-0" />
                <span className="font-bold leading-5 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
                  Log in with Facebook
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex gap-[8px] items-center w-full">
              <div className="flex-1 h-px bg-fg-grey-200" />
              <p className="font-normal leading-5 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
                or
              </p>
              <div className="flex-1 h-px bg-fg-grey-200" />
            </div>

            {/* Form Fields */}
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[400px]">
              {/* Username/Email */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-medium leading-5 min-h-px min-w-px relative text-fg-grey-700 text-sm tracking-fg">
                    Username/email
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Your username/email. . ."
                  className="bg-white border border-fg-grey-100 border-solid overflow-clip px-[16px] py-[12px] rounded-full shrink-0 w-full font-normal leading-5 text-fg-black text-sm tracking-fg placeholder:text-fg-grey-700 focus:outline-fg-violet focus:outline-1"
                />
              </div>

              {/* Password */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-medium leading-5 min-h-px min-w-px relative text-fg-grey-700 text-sm tracking-fg">
                    Password
                  </p>
                  <a href="/templates/auth/forgot-password" className="font-bold leading-5 text-fg-violet text-sm tracking-fg whitespace-nowrap hover:underline">
                    Forgot Password
                  </a>
                </div>
                <div className="bg-white border border-fg-grey-100 border-solid content-stretch flex gap-[4px] items-center overflow-clip px-[16px] py-[12px] relative rounded-full shrink-0 w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password. . ."
                    className="flex-[1_0_0] h-[24px] bg-transparent outline-none font-normal leading-5 text-fg-black text-sm tracking-fg placeholder:text-fg-grey-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex items-center justify-center size-[24px] shrink-0 text-fg-grey-700 hover:text-fg-black transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeLinear size={20} /> : <EyeClosedLinear size={20} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button className="bg-fg-violet content-stretch flex items-center justify-center overflow-clip px-[16px] py-[14px] relative rounded-full shrink-0 w-full cursor-pointer hover:opacity-90 transition-opacity">
                <span className="font-bold leading-5 text-sm text-white tracking-fg whitespace-nowrap">
                  Log in
                </span>
              </button>
            </div>

            {/* Register Link */}
            <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-[400px]">
              <p className="font-normal leading-5 relative shrink-0 text-fg-grey-700 text-sm tracking-fg whitespace-nowrap">
                Don&apos;t have an account?
              </p>
              <a href="/templates/auth/sign-up" className="font-bold leading-5 relative shrink-0 text-fg-violet text-sm tracking-fg whitespace-nowrap hover:underline">
                Register now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
