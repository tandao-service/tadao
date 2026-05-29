"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "../ui/use-toast";

import { packageFormSchema } from "@/lib/validator";
import { PackagesDefaultValues } from "@/constants";
import { useUploadThing } from "@/lib/uploadthing";
import { createPackage, updatePackage } from "@/lib/actions/packages.actions";
import { FileUploaderPackage } from "./FileuploaderPackage";

type PackageFormProps = {
  type: "Create" | "Update";
  pack?: any;
  packageId?: string;
  onSaved?: () => void;
};

const PackageForm = ({ type, pack, packageId, onSaved }: PackageFormProps) => {
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");

  const [files, setFiles] = useState<File[]>([]);
  const [showmessage, setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureChecked, setNewFeatureChecked] = useState(true);

  const [newPeriod, setNewPeriod] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const [newPeriod2, setNewPeriod2] = useState("");
  const [newAmount2, setNewAmount2] = useState("");

  const initialValues =
    pack && type === "Update"
      ? ({
        ...pack,
        features: pack?.features ?? [],
        price: pack?.price ?? [],
        price2: pack?.price2 ?? [],
        entitlements: {
          maxListings: pack?.entitlements?.maxListings ?? pack?.list ?? 0,
          priority: pack?.entitlements?.priority ?? pack?.priority ?? 0,
          topDays: pack?.entitlements?.topDays ?? 0,
          featuredDays: pack?.entitlements?.featuredDays ?? 0,
          autoRenewHours: pack?.entitlements?.autoRenewHours ?? null,
        },
      } as any)
      : ({
        ...PackagesDefaultValues,
        price2: (PackagesDefaultValues as any)?.price2 ?? [],
        entitlements: {
          maxListings: 0,
          priority: 0,
          topDays: 0,
          featuredDays: 0,
          autoRenewHours: null,
        },
      } as any);

  const form = useForm<z.infer<typeof packageFormSchema>>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: initialValues,
  });

  const maxListingsValue = form.watch("entitlements.maxListings");
  const watchName = form.watch("name");
  const watchDescription = form.watch("description");
  const watchColor = form.watch("color");
  const watchPrice = form.watch("price");
  const watchFeatures = form.watch("features");
  const watchEntitlements = form.watch("entitlements");

  useEffect(() => {
    const currentFeatures = form.getValues("features") || [];
    const numericList = Number(maxListingsValue) || 0;

    const updatedFeatures = currentFeatures.map((f: any) => {
      const isAllowedListingFeature =
        typeof f.title === "string" &&
        f.title.toLowerCase().includes("allowed listings");

      if (isAllowedListingFeature) {
        return {
          ...f,
          title: `${numericList} Allowed Listings`,
        };
      }

      return f;
    });

    form.setValue("features", updatedFeatures, { shouldDirty: true });
  }, [maxListingsValue, form]);

  async function onSubmit(values: z.infer<typeof packageFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    try {
      setShowAlert(false);

      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (!uploadedImages) return;
        uploadedImageUrl = uploadedImages[0].url;
      }

      const maxListings = Number(values.entitlements?.maxListings ?? 0);
      const entPriority = Number(values.entitlements?.priority ?? 0);

      const payload = {
        ...values,
        imageUrl: uploadedImageUrl,
        list: maxListings,
        priority: entPriority,
        entitlements: {
          maxListings,
          priority: entPriority,
          topDays: Number(values.entitlements?.topDays ?? 0),
          featuredDays: Number(values.entitlements?.featuredDays ?? 0),
          autoRenewHours:
            values.entitlements?.autoRenewHours === null ||
              values.entitlements?.autoRenewHours === undefined
              ? null
              : Number(values.entitlements.autoRenewHours),
        },
        features: values.features ?? [],
        price: values.price ?? [],
        price2: (values as any).price2 ?? [],
      };

      if (type === "Create") {
        const newPack = await createPackage({
          pack: payload as any,
          path: "/admin/packages",
        });

        if (newPack) {
          form.reset();
          onSaved?.();
          toast({
            title: "Created",
            description: "Package created successfully.",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });
        }
      }

      if (type === "Update") {
        if (!packageId) return;

        const updatedPack = await updatePackage({
          pack: {
            ...(payload as any),
            _id: packageId,
          },
          path: "/admin/packages",
        });

        if (updatedPack) {
          onSaved?.();
          toast({
            title: "Updated",
            description: "Package updated successfully.",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowAlert(true);
      setmessage("Error submitting package. Check console for details.");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {showAlert && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{showmessage}</AlertDescription>
          </Alert>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <Section title="Basic Details" subtitle="Package name, description, color and image.">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Package Name</Label>
                          <FormControl>
                            <Input placeholder="e.g. Gold" {...field} className="h-11 rounded-2xl bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Package Color</Label>
                          <FormControl>
                            <div className="flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3">
                              <input
                                type="color"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="h-7 w-10 cursor-pointer rounded"
                              />
                              <span className="text-sm text-slate-500">{field.value}</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Description</Label>
                        <FormControl>
                          <Textarea
                            placeholder="Short package description"
                            {...field}
                            className="min-h-[90px] rounded-2xl bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Package Image</Label>
                        <FormControl>
                          <FileUploaderPackage
                            onFieldChange={field.onChange}
                            imageUrl={field.value}
                            setFiles={setFiles}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Section>

                <Section title="Entitlements" subtitle="Controls posting limits and advert visibility.">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <NumberField form={form} name="entitlements.maxListings" label="Max Listings" />
                    <NumberField form={form} name="entitlements.priority" label="Priority" />
                    <NumberField form={form} name="entitlements.topDays" label="Top Days" />
                    <NumberField form={form} name="entitlements.featuredDays" label="Featured Days" />

                    <FormField
                      control={form.control}
                      name="entitlements.autoRenewHours"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Auto Renew Hours</Label>
                          <FormControl>
                            <Input
                              value={field.value === null ? "" : String(field.value)}
                              onChange={(e) =>
                                field.onChange(e.target.value === "" ? null : Number(e.target.value))
                              }
                              placeholder="Leave empty for none"
                              className="h-11 rounded-2xl bg-white"
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                <Section title="Features" subtitle="Features shown to users on package cards.">
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-3">
                            {(field.value || []).map((feature: any, index: number) => {
                              const isAllowedListingFeature =
                                typeof feature.title === "string" &&
                                feature.title.toLowerCase().includes("allowed listings");

                              return (
                                <div
                                  key={index}
                                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                                >
                                  {isAllowedListingFeature ? (
                                    <p className="text-sm font-medium text-slate-700">{feature.title}</p>
                                  ) : (
                                    <Input
                                      value={feature.title}
                                      onChange={(e) => {
                                        const updated = [...(field.value || [])];
                                        updated[index] = {
                                          ...updated[index],
                                          title: e.target.value,
                                        };
                                        field.onChange(updated);
                                      }}
                                      placeholder="Feature title"
                                      className="h-10 rounded-xl border-slate-200"
                                    />
                                  )}

                                  <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <Checkbox
                                      checked={Boolean(feature.checked)}
                                      onCheckedChange={(checked) => {
                                        const updated = [...(field.value || [])];
                                        updated[index] = {
                                          ...updated[index],
                                          checked: Boolean(checked),
                                        };
                                        field.onChange(updated);
                                      }}
                                    />
                                    Enabled
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (field.value || []).filter(
                                        (_: any, i: number) => i !== index
                                      );
                                      field.onChange(updated);
                                    }}
                                    className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              );
                            })}

                            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 md:grid-cols-[1fr_auto_auto]">
                              <Input
                                value={newFeatureTitle}
                                onChange={(e) => setNewFeatureTitle(e.target.value)}
                                placeholder="Add feature title"
                                className="h-10 rounded-xl"
                              />

                              <label className="flex items-center gap-2 text-sm text-slate-600">
                                <Checkbox
                                  checked={newFeatureChecked}
                                  onCheckedChange={(checked) => setNewFeatureChecked(Boolean(checked))}
                                />
                                Enabled
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  if (!newFeatureTitle.trim()) return;
                                  field.onChange([
                                    ...(field.value || []),
                                    {
                                      title: newFeatureTitle.trim(),
                                      checked: newFeatureChecked,
                                    },
                                  ]);
                                  setNewFeatureTitle("");
                                  setNewFeatureChecked(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                              >
                                <Plus className="h-4 w-4" />
                                Add
                              </button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Section>

                <PriceSection
                  title="Normal Package Prices"
                  subtitle="Used for normal categories."
                  form={form}
                  fieldName="price"
                  newPeriod={newPeriod}
                  setNewPeriod={setNewPeriod}
                  newAmount={newAmount}
                  setNewAmount={setNewAmount}
                />

                <PriceSection
                  title="Financing Package Prices"
                  subtitle="Used for Assets Financing packages."
                  form={form}
                  fieldName="price2"
                  newPeriod={newPeriod2}
                  setNewPeriod={setNewPeriod2}
                  newAmount={newAmount2}
                  setNewAmount={setNewAmount2}
                />
              </div>

              <aside className="hidden xl:block">
                <div className="sticky top-0 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                    Preview
                  </p>

                  <div
                    className="mt-4 rounded-3xl p-5 text-white"
                    style={{ backgroundColor: watchColor || "#f97316" }}
                  >
                    <p className="text-xl font-semibold">{watchName || "Package Name"}</p>
                    <p className="mt-2 text-sm text-white/85">
                      {watchDescription || "Package description will appear here."}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <PreviewRow label="Listings" value={watchEntitlements?.maxListings ?? 0} />
                    <PreviewRow label="Priority" value={watchEntitlements?.priority ?? 0} />
                    <PreviewRow label="Top Days" value={watchEntitlements?.topDays ?? 0} />
                    <PreviewRow label="Featured Days" value={watchEntitlements?.featuredDays ?? 0} />
                    <PreviewRow
                      label="Auto Renew"
                      value={
                        watchEntitlements?.autoRenewHours
                          ? `${watchEntitlements.autoRenewHours} hrs`
                          : "-"
                      }
                    />
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-900">Prices</p>
                    <div className="space-y-2">
                      {(watchPrice || []).slice(0, 4).map((p: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                        >
                          <span>{p.period}</span>
                          <span className="font-semibold">
                            KES {Number(p.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-900">Features</p>
                    <ul className="space-y-2">
                      {(watchFeatures || []).slice(0, 5).map((f: any, i: number) => (
                        <li key={i} className="text-sm text-slate-600">
                          {f.checked ? "✓" : "✕"} {f.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 bg-white pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full rounded-2xl bg-slate-950 hover:bg-orange-500"
            >
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting
                ? "Saving..."
                : type === "Create"
                  ? "Create Package"
                  : "Save Package Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-medium text-slate-700">{children}</p>;
}

function NumberField({ form, name, label }: { form: any; name: any; label: string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Label>{label}</Label>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
              className="h-11 rounded-2xl bg-white"
              type="number"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PriceSection({
  title,
  subtitle,
  form,
  fieldName,
  newPeriod,
  setNewPeriod,
  newAmount,
  setNewAmount,
}: {
  title: string;
  subtitle: string;
  form: any;
  fieldName: "price" | "price2";
  newPeriod: string;
  setNewPeriod: (value: string) => void;
  newAmount: string;
  setNewAmount: (value: string) => void;
}) {
  return (
    <Section title={title} subtitle={subtitle}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="space-y-3">
                {(field.value || []).map((price: any, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <Input
                      value={price.period}
                      onChange={(e) => {
                        const updated = [...(field.value || [])];
                        updated[index] = {
                          ...updated[index],
                          period: e.target.value,
                        };
                        field.onChange(updated);
                      }}
                      placeholder="Period"
                      className="h-10 rounded-xl"
                    />

                    <Input
                      value={price.amount}
                      type="number"
                      onChange={(e) => {
                        const updated = [...(field.value || [])];
                        updated[index] = {
                          ...updated[index],
                          amount: e.target.value === "" ? 0 : Number(e.target.value),
                        };
                        field.onChange(updated);
                      }}
                      placeholder="Amount"
                      className="h-10 rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updated = (field.value || []).filter(
                          (_: any, i: number) => i !== index
                        );
                        field.onChange(updated);
                      }}
                      className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 md:grid-cols-[1fr_1fr_auto]">
                  <Input
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    placeholder="Period e.g. 1 month"
                    className="h-10 rounded-xl"
                  />

                  <Input
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Amount"
                    type="number"
                    className="h-10 rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!newPeriod.trim()) return;
                      field.onChange([
                        ...(field.value || []),
                        {
                          period: newPeriod.trim(),
                          amount: Number(newAmount || 0),
                        },
                      ]);
                      setNewPeriod("");
                      setNewAmount("");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Section>
  );
}

function PreviewRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default PackageForm;