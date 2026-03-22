"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserDefaultValues } from "@/constants";
import { UserFormSchema } from "@/lib/validator";
import {
  deleteUser,
  updateUserFromSettings,
  updateUserPhone,
  updateUserPhoto,
} from "@/lib/actions/user.actions";
import { useToast } from "@/components/ui/use-toast";
import { TextField } from "@mui/material";
import { useUploadThing } from "@/lib/uploadthing";
import { verificationStatus } from "@/lib/actions/verificationstatus";
import PhoneVerification from "./PhoneVerification";
import { useAuth } from "@/app/hooks/useAuth";
import imageCompression from "browser-image-compression";

type setingsProp = {
  type: "Create" | "Update";
  user?: any;
  userId?: string;
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
    backgroundColor: "white",
  },
};

const SettingsEdit = ({ user, type, userId }: setingsProp) => {
  const { toast } = useToast();
  const { user: currentUser, signOutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("OrderTrackingId")) {
      const orderTrackingId = query.get("OrderTrackingId");
      const plan = sessionStorage.getItem("plan");
      const period = sessionStorage.getItem("period");
      const amount = parseInt(sessionStorage.getItem("amount") || "0");
      const planId = sessionStorage.getItem("planId");
      const buyerId = sessionStorage.getItem("buyerId");
      const phone = sessionStorage.getItem("phone");
      const firstName = sessionStorage.getItem("firstName");
      const middleName = sessionStorage.getItem("middleName");
      const lastName = sessionStorage.getItem("lastName");
      const email = sessionStorage.getItem("email");

      const transaction = {
        plan,
        amount,
        period,
        planId,
        buyerId,
        phone,
        firstName,
        middleName,
        lastName,
        email,
        orderTrackingId: orderTrackingId || "",
      };

      const checkstatus = async ({ transaction }: any) => {
        const response = await verificationStatus(transaction);

        if (response === "success") {
          toast({
            title: "Verification successful!",
            description: "You will receive an email confirmation",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });

          router.push("/settings/");
        } else if (response === "failed") {
          toast({
            variant: "destructive",
            title: "Verification canceled!",
            description:
              "Continue to shop around and checkout when you're ready",
            duration: 5000,
          });
        }
      };

      checkstatus({ transaction });
    }
  }, [router, toast]);

  const [countryCode, setCountryCode] = useState(
    user?.phone ? user.phone.substring(0, 4) : "+254"
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone ? user.phone.substring(user.phone.length - 9) : ""
  );
  const [countryCodeWhatsapp, setCountryCodeWhatsapp] = useState(
    user?.whatsapp ? user?.whatsapp.substring(0, 4) : "+254"
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    user?.whatsapp ? user?.whatsapp.substring(user?.whatsapp.length - 9) : ""
  );

  const initialValues =
    user && type === "Update"
      ? {
        ...user,
      }
      : UserDefaultValues;

  const [selectedDays, setSelectedDays] = useState<string[]>(
    user?.businessworkingdays ?? []
  );
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const [startHour, setStartHour] = useState(
    user?.businesshours?.[0]?.openHour ?? "09"
  );
  const [startMinute, setStartMinute] = useState(
    user?.businesshours?.[0]?.openMinute ?? "00"
  );
  const [endHour, setEndHour] = useState(
    user?.businesshours?.[0]?.closeHour ?? "17"
  );
  const [endMinute, setEndMinute] = useState(
    user?.businesshours?.[0]?.closeMinute ?? "00"
  );

  const [changePhone, setChangePhone] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof UserFormSchema>) {
    if (type === "Update") {
      try {
        if (!userId) {
          router.back();
          return;
        }

        let uploadedImageUrl = values.imageUrl;

        if (files.length > 0) {
          await Promise.all(
            files.map(async (file: File) => {
              try {
                const uploadedImages = await startUpload([file]);
                if (uploadedImages && uploadedImages.length > 0) {
                  uploadedImageUrl = uploadedImages[0].url;
                }
              } catch (error) {
                console.error("Error uploading file:", error);
              }
            })
          );
        }

        const updatedUser = await updateUserFromSettings({
          user: {
            ...values,
            imageUrl: uploadedImageUrl,
            phone: phoneNumber ? countryCode + removeLeadingZero(phoneNumber) : "",
            whatsapp: whatsappNumber
              ? countryCodeWhatsapp + removeLeadingZero(whatsappNumber)
              : "",
            businesshours: [
              {
                openHour: startHour,
                openMinute: startMinute,
                closeHour: endHour,
                closeMinute: endMinute,
              },
            ],
            _id: userId,
          },
          path: `/settings/`,
        });

        if (updatedUser) {
          toast({
            title: "Successful!",
            description: "You have updated your details successfully",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      const noofdays = selectedDays.filter((d: any) => d !== day);
      form.setValue("businessworkingdays", noofdays);
      setSelectedDays(noofdays);
    } else {
      const noofdays = [...selectedDays, day];
      form.setValue("businessworkingdays", noofdays);
      setSelectedDays(noofdays);
    }
  };

  const formatPhoneNumber = (input: any) => {
    const cleaned = input.replace(/\D/g, "");

    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 7) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    } else if (cleaned.length < 11) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(
        6,
        10
      )}`;
    }
  };

  const handleCountryCodeChangeWhatsapp = (e: any) => {
    setCountryCodeWhatsapp(e.target.value);
  };

  const handleInputChangeWhatsapp = (e: any) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setWhatsappNumber(formatted);
  };

  function removeLeadingZero(numberString: string) {
    if (numberString.charAt(0) === "0") {
      return numberString.substring(1);
    } else {
      return numberString;
    }
  }

  const handleVerified = async (phone: string) => {
    await updateUserPhone(userId || "", phone);
    const cleanNumber = phone.startsWith("+") ? phone.slice(1) : phone;
    const countryCode = cleanNumber.slice(0, 3);
    const localNumber = cleanNumber.slice(3);
    setCountryCode("+" + countryCode);
    setPhoneNumber(localNumber);
    setChangePhone(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);

    try {
      let uploadedImageUrl = "";
      const files = Array.from(e.target.files);

      if (files.length > 0) {
        await Promise.all(
          files.map(async (file: File) => {
            try {
              const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
              });

              const uploadedImages = await startUpload([compressedFile]);
              if (uploadedImages && uploadedImages.length > 0) {
                uploadedImageUrl = uploadedImages[0].url;
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          })
        );
      }

      const photo = uploadedImageUrl;
      const olderphoto = user?.photo || "";
      const _id = userId || "";
      await updateUserPhoto(_id, photo, olderphoto);
      user.photo = photo;

      alert("Profile picture updated ✅");
    } catch (err) {
      console.error("Error in handleImageUpload:", err);
      alert("Image upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    )
      return;

    try {
      const olderphoto = user?.photo || "";
      await deleteUser(user.clerkId, olderphoto);
      if (currentUser) await firebaseDeleteUser(currentUser);
      await signOutUser();
      router.push("/auth");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account ❌");
    }
  };

  const sectionCard =
    "rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1B2225]";
  const sectionTitle =
    "mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-orange-500";
  const rowClass = "grid grid-cols-1 gap-4 md:grid-cols-2";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
          defaultValue="item-1"
        >
          <AccordionItem
            value="item-1"
            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white px-0 shadow-sm dark:border-slate-700 dark:bg-[#1B2225]"
          >
            <AccordionTrigger className="px-5 py-4 text-left text-base font-bold hover:no-underline">
              Personal Details
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5">
              <div className={sectionCard}>
                <div className={sectionTitle}>Profile Photo</div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt="Profile"
                        className="h-20 w-20 rounded-full border border-orange-100 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-2xl">
                        👤
                      </div>
                    )}

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span>Upload Photo</span>
                    </label>
                  </div>

                  {uploading ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CircularProgress sx={{ color: "orange" }} size={20} />
                      <span>Uploading photo...</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className={`${sectionCard} mt-4`}>
                <div className={sectionTitle}>Personal Information</div>

                <div className={rowClass}>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="First Name" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Last Name" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Personal Email" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white px-0 shadow-sm dark:border-slate-700 dark:bg-[#1B2225]"
          >
            <AccordionTrigger className="px-5 py-4 text-left text-base font-bold hover:no-underline">
              Business Details
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5">
              <div className={sectionCard}>
                <div className={sectionTitle}>Business Profile</div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Business Name" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aboutbusiness"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField
                            {...field}
                            multiline
                            rows={5}
                            label="About Business"
                            variant="outlined"
                            fullWidth
                            sx={inputSx}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessaddress"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Business Address" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className={rowClass}>
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField {...field} label="Latitude" variant="outlined" fullWidth sx={inputSx} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField {...field} label="Longitude" variant="outlined" fullWidth sx={inputSx} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className={`${sectionCard} mt-4`}>
                <div className={sectionTitle}>Business Hours</div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#2D3236]">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Opening Time
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-600 dark:bg-[#1B2225]"
                        value={startHour}
                        onChange={(e) => setStartHour(e.target.value)}
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <option key={hour} value={hour.toString().padStart(2, "0")}>
                            {hour.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>

                      <select
                        className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-600 dark:bg-[#1B2225]"
                        value={startMinute}
                        onChange={(e) => setStartMinute(e.target.value)}
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                          <option key={minute} value={minute.toString().padStart(2, "0")}>
                            {minute.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#2D3236]">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Closing Time
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-600 dark:bg-[#1B2225]"
                        value={endHour}
                        onChange={(e) => setEndHour(e.target.value)}
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <option key={hour} value={hour.toString().padStart(2, "0")}>
                            {hour.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>

                      <select
                        className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-600 dark:bg-[#1B2225]"
                        value={endMinute}
                        onChange={(e) => setEndMinute(e.target.value)}
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                          <option key={minute} value={minute.toString().padStart(2, "0")}>
                            {minute.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${sectionCard} mt-4`}>
                <div className={sectionTitle}>Working Days</div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {days.map((day) => {
                    const active = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active
                          ? "border-orange-200 bg-orange-50 text-orange-600"
                          : "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50"
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white px-0 shadow-sm dark:border-slate-700 dark:bg-[#1B2225]"
          >
            <AccordionTrigger className="px-5 py-4 text-left text-base font-bold hover:no-underline">
              Contact Details
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5">
              <div className={sectionCard}>
                <div className={sectionTitle}>Phone Verification</div>

                {phoneNumber && !changePhone ? (
                  <div className="space-y-3">
                    <TextField
                      disabled
                      label="Phone (Verified)"
                      type="tel"
                      value={`${countryCode}${phoneNumber}`}
                      variant="outlined"
                      fullWidth
                      sx={inputSx}
                    />
                    <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                      <p className="text-sm font-semibold text-emerald-700">
                        ✅ Phone verified
                      </p>
                      <button
                        type="button"
                        onClick={() => setChangePhone(true)}
                        className="text-sm font-semibold text-orange-600 underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#2D3236]">
                    <h3 className="mb-3 text-lg font-bold">Verify Your Phone</h3>
                    <PhoneVerification onVerified={handleVerified} />
                  </div>
                )}
              </div>

              <div className={`${sectionCard} mt-4`}>
                <div className={sectionTitle}>WhatsApp</div>

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex flex-col gap-3 md:flex-row">
                          <select
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-600 dark:bg-[#2D3236] md:w-[180px]"
                            value={countryCodeWhatsapp}
                            onChange={handleCountryCodeChangeWhatsapp}
                          >
                            <option value="+254">Kenya (+254)</option>
                            <option value="+213">Algeria (+213)</option>
                            <option value="+244">Angola (+244)</option>
                            <option value="+229">Benin (+229)</option>
                            <option value="+267">Botswana (+267)</option>
                            <option value="+226">Burkina Faso (+226)</option>
                            <option value="+257">Burundi (+257)</option>
                            <option value="+237">Cameroon (+237)</option>
                            <option value="+238">Cape Verde (+238)</option>
                            <option value="+236">Central African Republic (+236)</option>
                            <option value="+235">Chad (+235)</option>
                            <option value="+269">Comoros (+269)</option>
                            <option value="+243">Democratic Republic of the Congo (+243)</option>
                            <option value="+253">Djibouti (+253)</option>
                            <option value="+20">Egypt (+20)</option>
                            <option value="+240">Equatorial Guinea (+240)</option>
                            <option value="+291">Eritrea (+291)</option>
                            <option value="+268">Eswatini (+268)</option>
                            <option value="+251">Ethiopia (+251)</option>
                            <option value="+241">Gabon (+241)</option>
                            <option value="+220">Gambia (+220)</option>
                            <option value="+233">Ghana (+233)</option>
                            <option value="+224">Guinea (+224)</option>
                            <option value="+245">Guinea-Bissau (+245)</option>
                            <option value="+225">Ivory Coast (+225)</option>
                            <option value="+266">Lesotho (+266)</option>
                            <option value="+231">Liberia (+231)</option>
                            <option value="+218">Libya (+218)</option>
                            <option value="+261">Madagascar (+261)</option>
                            <option value="+265">Malawi (+265)</option>
                            <option value="+223">Mali (+223)</option>
                            <option value="+222">Mauritania (+222)</option>
                            <option value="+230">Mauritius (+230)</option>
                            <option value="+212">Morocco (+212)</option>
                            <option value="+258">Mozambique (+258)</option>
                            <option value="+264">Namibia (+264)</option>
                            <option value="+227">Niger (+227)</option>
                            <option value="+234">Nigeria (+234)</option>
                            <option value="+242">Republic of the Congo (+242)</option>
                            <option value="+250">Rwanda (+250)</option>
                            <option value="+239">Sao Tome and Principe (+239)</option>
                            <option value="+221">Senegal (+221)</option>
                            <option value="+248">Seychelles (+248)</option>
                            <option value="+232">Sierra Leone (+232)</option>
                            <option value="+252">Somalia (+252)</option>
                            <option value="+27">South Africa (+27)</option>
                            <option value="+211">South Sudan (+211)</option>
                            <option value="+249">Sudan (+249)</option>
                            <option value="+255">Tanzania (+255)</option>
                            <option value="+228">Togo (+228)</option>
                            <option value="+216">Tunisia (+216)</option>
                            <option value="+256">Uganda (+256)</option>
                            <option value="+260">Zambia (+260)</option>
                            <option value="+263">Zimbabwe (+263)</option>
                          </select>

                          <TextField
                            {...field}
                            label="WhatsApp Number"
                            type="tel"
                            value={whatsappNumber}
                            onChange={handleInputChangeWhatsapp}
                            variant="outlined"
                            fullWidth
                            sx={inputSx}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white px-0 shadow-sm dark:border-slate-700 dark:bg-[#1B2225]"
          >
            <AccordionTrigger className="px-5 py-4 text-left text-base font-bold hover:no-underline">
              Social Media
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5">
              <div className={sectionCard}>
                <div className={sectionTitle}>Social Links</div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Facebook Link" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Twitter Link" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Instagram Link" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="TikTok Link" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <TextField {...field} label="Website" variant="outlined" fullWidth sx={inputSx} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="h-12 flex-1 rounded-2xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600"
          >
            <div className="flex items-center gap-2">
              {form.formState.isSubmitting && (
                <CircularProgress sx={{ color: "white" }} size={22} />
              )}
              {form.formState.isSubmitting
                ? "Saving..."
                : type === "Update"
                  ? "Save Changes"
                  : "Create User"}
            </div>
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="h-12 rounded-2xl px-6"
          >
            Delete Account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsEdit;
function firebaseDeleteUser(currentUser: { [key: string]: any; _id: string; clerkId: string; email: string; firstName: string; lastName: string; photo?: string; imageUrl?: string; status?: string; businessname?: string; aboutbusiness?: string; businessaddress?: string; latitude?: string; longitude?: string; businesshours?: { openHour: string; openMinute: string; closeHour: string; closeMinute: string; }[]; businessworkingdays?: string[]; phone?: string; whatsapp?: string; website?: string; facebook?: string; twitter?: string; instagram?: string; tiktok?: string; verified?: { accountverified: boolean; verifieddate: string | Date; }[]; token?: string; notifications?: { email: boolean; fcm: boolean; }; fee?: string | number; subscription?: { planId?: string | null; planName?: string; active?: boolean; expiresAt?: string | Date | null; remainingAds?: number; entitlements?: { maxListings?: number; priority?: number; topDays?: number; featuredDays?: number; autoRenewHours?: number | null; }; }; }) {
  throw new Error("Function not implemented.");
}

