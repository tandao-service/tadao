"use client";

import React, { useEffect, useMemo, useState } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { BellIcon } from "lucide-react";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1";

import "react-quill/dist/quill.snow.css";

import { createValidationSchema } from "@/lib/createValidationSchema";
import { useUploadThing } from "@/lib/uploadthing";
import { createData, updateAd } from "@/lib/actions/dynamicAd.actions";
import { updateUserPhone } from "@/lib/actions/user.actions";
import { createLoan } from "@/lib/actions/loan.actions";
import { getSellPostGate } from "@/lib/actions/sell.actions";
import { BasicPackId, FreePackId, REGIONS_WITH_AREA } from "@/constants";

import CategorySelect from "./CategorySelect";
import SubCategorySelect from "./SubCategorySelect";
import { Multiselect } from "./Multiselect";
import AutoComplete from "./AutoComplete";
import MakeModelAutocomplete from "./MakeModelAutocomplete";
import { BulkPriceManager } from "./BulkPriceManager";
import DeliveryOptions from "./DeliveryOptions";
import PriceInput from "./PriceInput";
import PhoneVerification from "./PhoneVerification";
import BiddingCheckbox from "./BiddingCheckbox";
import { FileUploader } from "./FileUploader";
import SubscriptionRequiredModal from "./SubscriptionRequiredModal";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[300px] h-full flex flex-col items-center justify-center">
      <Icon icon={Gooeyballs} className="w-10 h-10 text-gray-500" />
    </div>
  ),
});

interface Field {
  name: string;
  type:
  | "text"
  | "number"
  | "money"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "multi-select"
  | "autocomplete"
  | "phone"
  | "year"
  | "youtube-link"
  | "price"
  | "rentprice"
  | "priceper"
  | "bulkprice"
  | "serviceprice"
  | "delivery"
  | "gps"
  | "propertyarea"
  | "virtualTourLink"
  | "notify"
  | "related-autocompletes";
  required?: boolean;
  options?: string[];
}

type PackagePrice = {
  amount: number;
  period: string;
};

type PackageFeature = {
  title?: string;
};

type Package = {
  imageUrl?: string;
  name: string;
  _id: string;
  description?: string;
  price: PackagePrice[];
  features: PackageFeature[] | string[];
  color?: string;
  priority: number;
  price2?: PackagePrice[];
};

type AdFormProps = {
  userId: string;
  userImage: string;
  user: any;
  type: "Create" | "Update";
  ad?: any;
  adId?: string;
  categories: any[];
  userName: string;
  category?: string;
  subcategory?: string;
  packagesList: Package[];
  payStatus?: string;
  tx?: string;
  handleOpenShop: (shopId: any) => void;
  handleAdView?: (ad: any) => void;
  handlePay: (id: string) => void;
  handleOpenTerms: () => void;
};

const generateDefaultValues = (fields: Field[]) => {
  const defaults: Record<string, any> = {
    category: "",
    subcategory: "",
    imageUrls: [],
    region: "",
    area: "",
  };

  fields.forEach((field) => {
    if (field.type === "text") defaults[field.name] = "";
    else if (field.type === "number") defaults[field.name] = 0;
    else if (field.type === "money") defaults[field.name] = 0;
    else if (field.type === "select") defaults[field.name] = field.options?.[0] || "";
    else if (field.type === "multi-select") defaults[field.name] = [];
    else if (field.type === "checkbox") defaults[field.name] = false;
    else if (field.type === "textarea") defaults[field.name] = "";
    else if (field.type === "autocomplete") defaults[field.name] = "";
    else if (field.type === "phone") defaults[field.name] = "";
    else if (field.type === "price") defaults["price"] = 0;
    else if (field.type === "rentprice") {
      defaults["price"] = 0;
      defaults["period"] = "";
    } else if (field.type === "bulkprice") {
      defaults["price"] = 0;
      defaults["bulkprice"] = [];
    } else if (field.type === "serviceprice") {
      defaults["price"] = 0;
      defaults["priceType"] = "specify";
      defaults["unit"] = "per service";
      defaults["negotiable"] = "not sure";
    } else if (field.type === "gps") defaults["gps"] = [];
    else if (field.type === "propertyarea") defaults["propertyarea"] = [];
    else if (field.type === "virtualTourLink") defaults["virtualTourLink"] = "";
    else if (field.type === "delivery") defaults["delivery"] = [];
    else if (field.type === "year") defaults[field.name] = "";
    else if (field.type === "youtube-link") defaults[field.name] = "";
    else if (field.type === "related-autocompletes") defaults[field.name] = "";
    else if (field.type === "radio") defaults[field.name] = field.options?.[0] || "";
  });

  return defaults;
};

function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseCurrencyToNumber(value: string): number {
  const cleaned = String(value || "").replace(/[^0-9.-]+/g, "");
  return Number(cleaned || 0);
}

function formatToCurrency(value: string | number) {
  if (value === null || value === undefined || value === "") return "0";
  const numberValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isNaN(numberValue) ? 0 : numberValue);
}

function removeLeadingZero(numberString: string) {
  return numberString.charAt(0) === "0"
    ? numberString.substring(1)
    : numberString;
}

function isValidKenyanPhoneNumber(phone: string): boolean {
  const kenyanPhoneRegex = /^(?:\+254|254|0)?(7\d{8})$/;
  return kenyanPhoneRegex.test(phone.trim());
}

const AdForm = ({
  userId,
  userImage,
  user,
  type,
  ad,
  adId,
  userName,
  packagesList,
  category,
  subcategory,
  categories,
  payStatus,
  handleAdView,
  handlePay,
  handleOpenTerms,
  handleOpenShop,
}: AdFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");

  const [coverThumbFile, setCoverThumbFile] = useState<File | null>(null);
  const [coverThumbPreview, setCoverThumbPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>(ad ? ad.data : {});
  const [selectedCategory, setSelectedCategory] = useState(ad ? ad.data.category : "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(ad ? ad.data.subcategory : "");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(ad ? ad.subcategory?._id : "");

  const [showload, setShowLoad] = useState(true);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formErrors_, setFormErrors_] = useState({
    bidIncrement: "",
    biddingEndsAt: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [defaults, setDefaults] = useState<Record<string, any>>({});
  const [anayze, setAnalyze] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupBulk, setShowPopupBulk] = useState(false);

  const [selectedCategoryCommand, setSelectedCategoryCommand] = useState<any[]>([]);
  const [countryCode, setCountryCode] = useState("+254");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);

  const [activePackage, setActivePackage] = useState<Package | null>(null);
  const [activeButton, setActiveButton] = useState(1);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 month");
  const [periodInput, setPeriodInput] = useState("1 month");

  const [daysRemaining, setDaysRemaining] = useState(0);
  const [remainingAds, setRemainingAds] = useState(0);

  const [Plan, setPlan] = useState(subcategory === "Assets Financing" ? "Basic" : "Free");
  const [PlanId, setPlanId] = useState(subcategory === "Assets Financing" ? BasicPackId : FreePackId);
  const [Priority_, setPriority] = useState(subcategory === "Assets Financing" ? 1 : 0);
  const [Adstatus_, setAdStatus] = useState("Pending");
  const [color, setColor] = useState("#000000");
  const [ExpirationDate_, setExpirationDate] = useState(new Date());
  const [priceInput, setPriceInput] = useState(0);
  const [listed, setListed] = useState(0);

  const isFinancing = selectedCategory === "Financing";

  const modules = {
    toolbar: [
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const constituencies =
    REGIONS_WITH_AREA.find((county) => county.region === selectedCounty)?.area || [];

  const filteredSubcategories = useMemo(() => {
    return categories
      .filter((item: any) => item.category.name === selectedCategory)
      .map((item: any) => ({
        subcategory: item.subcategory,
        imageUrl: item.imageUrl?.[0],
        _id: item._id,
      }))
      .filter(
        (value: any, index: number, self: any[]) =>
          index ===
          self.findIndex(
            (c: any) =>
              c.subcategory === value.subcategory && c._id === value._id
          )
      );
  }, [categories, selectedCategory]);

  const getPackagePrices = (pack: Package | null | undefined) => {
    if (!pack) return [];
    return String(selectedSubCategory).toLowerCase() === "assets financing"
      ? pack.price2 || []
      : pack.price || [];
  };

  const saveSellDraft = () => {
    try {
      const draft = {
        formData,
        selectedCategory,
        selectedSubCategory,
        selectedSubCategoryId,
        countryCode,
        phoneNumber,
        selectedCounty,
        selectedConstituency,
        activeButton,
        activeButtonTitle,
        planId: PlanId,
        planName: Plan,
        periodInput,
      };

      sessionStorage.setItem("sell_draft", JSON.stringify(draft));
    } catch (error) {
      console.error("Failed to save sell draft:", error);
    }
  };

  const clearSellDraft = () => {
    try {
      sessionStorage.removeItem("sell_draft");
    } catch (error) {
      console.error("Failed to clear sell draft:", error);
    }
  };

  useEffect(() => {
    if (payStatus === "success") {
      toast({
        title: "Payment successful",
        description: "Your subscription is active. Continue posting your ad.",
        duration: 5000,
        className: "bg-green-600 text-white",
      });
      router.refresh();
    }
  }, [payStatus, router, toast]);

  useEffect(() => {
    const uniqueCategories = categories.reduce((acc: any[], current: any) => {
      if (!acc.find((item) => item.category.name === current.category.name)) {
        acc.push(current);
      }
      return acc;
    }, []);

    setSelectedCategoryCommand(uniqueCategories);

    if (type === "Update" && ad) {
      const selectedData: any = categories.find(
        (cat: any) =>
          cat.category.name === ad.data.category &&
          cat.subcategory === ad.data.subcategory
      );

      const updateFields = selectedData ? selectedData.fields : [];
      const updateDefaults = generateDefaultValues(updateFields);

      setFields(updateFields);
      setDefaults(updateDefaults);
      setFormData(ad.data || {});
      setSelectedCategory(ad.data.category || "");
      setSelectedSubCategory(ad.data.subcategory || "");
      setSelectedSubCategoryId(ad.subcategory?._id || "");

      if (ad.data.phone) {
        const cleanNumber = ad.data.phone.startsWith("+")
          ? ad.data.phone.slice(1)
          : ad.data.phone;
        const code = cleanNumber.slice(0, 3);
        const localNumber = cleanNumber.slice(3);
        setCountryCode("+" + code);
        setPhoneNumber(localNumber);
      }

      setSelectedCounty(ad.data.region || null);
      setSelectedConstituency(ad.data.area || null);
      setShowLoad(false);
      return;
    }

    if (type === "Create" && subcategory && category !== "bids" && category) {
      const selectedData: any = categories.find(
        (ca: any) =>
          ca.category.name === category &&
          ca.subcategory === subcategory
      );

      const createFields = selectedData ? selectedData.fields : [];
      const createDefaults = generateDefaultValues(createFields);

      setSelectedCategory(category);
      setSelectedSubCategory(subcategory);
      setSelectedSubCategoryId(selectedData?._id || "");
      setFields(createFields);
      setDefaults(createDefaults);

      if (category === "Buyer Requests") {
        setFormData({
          ...createDefaults,
          category,
          subcategory,
          imageUrls: [userImage],
        });
      } else {
        setFormData({
          ...createDefaults,
          category,
          subcategory,
        });
      }
    }

    setShowLoad(false);
  }, [ad, categories, category, subcategory, type, userImage]);

  useEffect(() => {
    if (type !== "Create") return;

    try {
      const raw = sessionStorage.getItem("sell_draft");
      if (!raw) return;

      const draft = JSON.parse(raw);

      if (draft?.formData) setFormData(draft.formData);
      if (draft?.selectedCategory) setSelectedCategory(draft.selectedCategory);
      if (draft?.selectedSubCategory) setSelectedSubCategory(draft.selectedSubCategory);
      if (draft?.selectedSubCategoryId) setSelectedSubCategoryId(draft.selectedSubCategoryId);
      if (draft?.countryCode) setCountryCode(draft.countryCode);
      if (draft?.phoneNumber) setPhoneNumber(draft.phoneNumber);
      if (draft?.selectedCounty) setSelectedCounty(draft.selectedCounty);
      if (draft?.selectedConstituency) setSelectedConstituency(draft.selectedConstituency);
      if (typeof draft?.activeButton === "number") setActiveButton(draft.activeButton);
      if (draft?.activeButtonTitle) setActiveButtonTitle(draft.activeButtonTitle);
      if (draft?.planId) setPlanId(draft.planId);
      if (draft?.planName) setPlan(draft.planName);
      if (draft?.periodInput) setPeriodInput(draft.periodInput);
    } catch (error) {
      console.error("Failed to restore draft:", error);
    }
  }, [type]);

  useEffect(() => {
    if (!selectedCategory || !selectedSubCategory || !categories.length) return;

    const selectedData: any = categories.find(
      (item: any) =>
        item.category.name === selectedCategory &&
        item.subcategory === selectedSubCategory
    );

    const currentFields = selectedData?.fields || [];
    setFields(currentFields);
    setDefaults(generateDefaultValues(currentFields));
  }, [categories, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    const sub = user?.subscription;

    let planName = "Free";
    let planId = FreePackId;
    let priority = 0;
    let adStatus = "Active";
    let remaining = 0;
    let expiresAt: Date | null = null;

    if (sub && sub.planName && sub.planName.toLowerCase() !== "free") {
      planName = sub.planName;
      planId = sub.planId;
      priority = sub.entitlements?.priority ?? 0;
      remaining = sub.remainingAds ?? 0;
      expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;

      const expired =
        expiresAt instanceof Date && !isNaN(expiresAt.getTime())
          ? new Date() > expiresAt
          : false;

      adStatus = !sub.active || expired || remaining <= 0 ? "Pending" : "Active";

      if (expiresAt && !expired) {
        const diff =
          Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) || 0;
        setDaysRemaining(diff);
      } else {
        setDaysRemaining(0);
      }
    } else {
      const listedAds = Number(user?.ads || 0);
      const freePack: any = packagesList.find((p) => p.name === "Free");
      const freeLimit = Number((user?.currentpack?.list ?? freePack?.["list"] ?? 0) || 0);

      remaining = Math.max(freeLimit - listedAds, 0);
      adStatus = remaining > 0 ? "Active" : "Pending";
      setDaysRemaining(0);
    }

    setPlan(planName);
    setPlanId(planId);
    setPriority(priority);
    setAdStatus(adStatus);
    setRemainingAds(remaining);
    setExpirationDate(expiresAt ?? new Date());

    const pkg =
      packagesList.find((p: any) => p._id === planId) ??
      packagesList.find((p: any) => p.name === "Free");

    setActivePackage(pkg ?? null);
  }, [user, packagesList, selectedSubCategory]);

  useEffect(() => {
    if (!activePackage) return;
    const prices = getPackagePrices(activePackage);
    const row = prices[activeButton];
    if (row) {
      setPriceInput(Number(row.amount || 0));
      setPeriodInput(String(row.period || activeButtonTitle).trim());
    }
  }, [activeButton, activeButtonTitle, activePackage, selectedSubCategory]);

  const validateForm = async () => {
    const validationSchema = createValidationSchema(fields, selectedCategory);
    const result = validationSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.errors.reduce((acc: any, err: any) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setFormErrors(errors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];
    let i = 0;

    let coverThumbUrl: string | null = null;

    if (coverThumbFile) {
      try {
        const up = await startUpload([coverThumbFile]);
        if (up?.[0]?.url) coverThumbUrl = up[0].url;
      } catch (e) {
        console.error("Cover thumb upload failed:", e);
      }
    }

    for (const file of files) {
      try {
        i++;
        const uploadedImages = await startUpload([file]);
        if (uploadedImages?.[0]?.url) {
          uploadedUrls.push(uploadedImages[0].url);
          setUploadProgress(Math.round((i / files.length) * 100));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    return {
      fullUrls: uploadedUrls.filter((url) => !url.includes("blob:")),
      coverThumbUrl,
    };
  };

  const checkPostingGateBeforeUpload = async () => {
    const gate = await getSellPostGate(userId);

    if (!gate?.allowed) {
      saveSellDraft();
      setSubscriptionModalOpen(true);

      toast({
        title: "Subscription required",
        description: gate?.reason || "Choose a package to continue posting your ad.",
        duration: 5000,
        className: "bg-red-600 text-white",
      });

      return false;
    }

    return true;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChangeMoney = (field: string, value: string) => {
    const numericValue = value.replace(/,/g, "");
    setFormData((prev) => ({ ...prev, [field]: numericValue }));
  };

  const handleInputCategoryChange = (field: string, value: any) => {
    setSelectedCategory(value);
    setSelectedSubCategory("");
    setSelectedSubCategoryId("");
    setFields([]);
    setFiles([]);
    setCoverThumbFile(null);
    setCoverThumbPreview(null);
    setFormErrors({});

    if (value === "Financing") {
      setSelectedCounty(null);
      setSelectedConstituency(null);

      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
        region: "Kenya",
        area: "Countrywide",
        imageUrls: [],
      }));
      return;
    }

    if (value === "Buyer Requests") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        subcategory: "",
        imageUrls: [userImage],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
      subcategory: "",
      imageUrls: [],
    }));
  };

  const handleInputSubCategoryChange = (field: string, value: any, _id: string) => {
    setSelectedSubCategory(value);
    setSelectedSubCategoryId(_id);

    const selectedData: any = categories.find(
      (category: any) =>
        category.category.name === selectedCategory &&
        category.subcategory === value
    );

    const nextFields = selectedData ? selectedData.fields : [];
    const nextDefaults = generateDefaultValues(nextFields);

    setFields(nextFields);
    setDefaults(nextDefaults);
    setFormErrors({});
    setFiles([]);
    setCoverThumbFile(null);
    setCoverThumbPreview(null);

    const nextData: Record<string, any> = {
      ...nextDefaults,
      category: selectedCategory,
      [field]: value,
    };

    if (selectedCategory === "Financing") {
      nextData.region = "Kenya";
      nextData.area = "Countrywide";
    }

    if (selectedCategory === "Buyer Requests") {
      nextData.imageUrls = [userImage];
    }

    if (user?.user?.phone && type === "Create") {
      const cleanNumber = user.user.phone.startsWith("+")
        ? user.user.phone.slice(1)
        : user.user.phone;
      const code = cleanNumber.slice(0, 3);
      const localNumber = cleanNumber.slice(3);
      setCountryCode("+" + code);
      setPhoneNumber(localNumber);
      nextData.phone = user.user.phone;
    }

    setFormData(nextData);
  };

  const handleInputAutoCompleteChange = (field: string, value: any) => {
    if (field === "make") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(Object.prototype.hasOwnProperty.call(prev, "model") ? { model: "" } : {}),
      }));
      return;
    }

    if (field === "contact" && value === "contact") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        price: "0",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputYearChange = (field: string, value: any) => {
    setSelectedYear(value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputOnChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: any) => {
    const currentSelection = formData[field] || [];
    const isSelected = currentSelection.includes(value);

    const updatedSelection = isSelected
      ? currentSelection.filter((selected: any) => selected !== value)
      : [...currentSelection, value];

    setFormData((prev) => ({ ...prev, [field]: updatedSelection }));
  };

  const handleCounty = (field: string, value: any) => {
    setSelectedCounty(value);
    setSelectedConstituency(null);
    setFormData((prev) => ({ ...prev, [field]: value, area: "" }));
  };

  const handleConstituency = (field: string, value: any) => {
    setSelectedConstituency(value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);

    const prices = getPackagePrices(activePackage);
    if (prices && prices[index]) {
      setPriceInput(Number(prices[index]?.amount || 0));
      setPeriodInput(String(prices[index]?.period || title).trim());
    }
  };

  const handleClick = (pack: Package) => {
    const currDate = new Date();
    const expirationDate = new Date(currDate);
    expirationDate.setMonth(currDate.getMonth() + 1);

    setAdStatus(pack.name === "Free" ? "Active" : "Pending");
    setActivePackage(pack);
    setPlanId(pack._id);
    setPlan(pack.name);
    setPriority(pack.priority);
    setExpirationDate(expirationDate);

    const prices = getPackagePrices(pack);
    if (prices && prices[activeButton]) {
      setPriceInput(Number(prices[activeButton]?.amount || 0));
      setPeriodInput(String(prices[activeButton]?.period || activeButtonTitle).trim());
    }
  };

  const handleVerified = async (phone: string) => {
    await updateUserPhone(userId, phone);

    const cleanNumber = phone.startsWith("+") ? phone.slice(1) : phone;
    const code = cleanNumber.slice(0, 3);
    const localNumber = cleanNumber.slice(3);

    setCountryCode("+" + code);
    setPhoneNumber(localNumber);
    setFormData((prev) => ({ ...prev, phone }));

    if (user?.user) {
      user.user.phone = phone;
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1959 }, (_, i) =>
    String(currentYear - i)
  );

  const handleSubmit = async () => {
    setLoading(true);
    setUploadProgress(0);

    try {
      if (formData.biddingEnabled) {
        const errors = { ...formErrors_ };

        if (!formData.bidIncrement || Number(formData.bidIncrement) <= 0) {
          errors.bidIncrement = "Bid Increment must be a number greater than 0.";
          setFormErrors_(errors);
          setLoading(false);
          return;
        }

        const biddingEndDate = new Date(formData.biddingEndsAt);
        const now = new Date();

        if (!formData.biddingEndsAt || biddingEndDate <= now) {
          errors.biddingEndsAt = "Bidding End Date must be a valid future date.";
          setFormErrors_(errors);
          setLoading(false);
          return;
        }

        setFormErrors_({
          bidIncrement: "",
          biddingEndsAt: "",
        });
      }

      if (type === "Create") {
        const isValid = await validateForm();
        if (!isValid) {
          toast({
            variant: "destructive",
            title: "Missing fields",
            description: "Ensure all required fields are completed.",
            duration: 5000,
          });
          setLoading(false);
          return;
        }

        const phone = countryCode + removeLeadingZero(phoneNumber);

        if (!isValidKenyanPhoneNumber(phone)) {
          toast({
            variant: "destructive",
            title: "Invalid Phone",
            description: "Invalid Phone Number.",
            duration: 5000,
          });
          setLoading(false);
          return;
        }

        try {
          if (
            selectedCategory === "Buyer Requests" &&
            selectedSubCategory.trim().toLowerCase() === "loan request"
          ) {
            await createLoan({
              loan: {
                userId,
                adId: null,
                loanType: formData["Loan Type"]?.toString() || "",
                LoanAmount: parseCurrencyToNumber(formData["Loan Amount"]?.toString() || "0"),
                monthlyIncome: parseCurrencyToNumber(formData["Monthly Income"]?.toString() || "0"),
                deposit: parseCurrencyToNumber(formData["Deposit Amount"]?.toString() || "0"),
                loanterm: formData["Preferred Loan Term"]?.toString() || "",
                employmentStatus: formData["Employment Status"]?.toString() || "",
                messageComments: formData["Comment"]?.toString() || "",
                status: "Pending",
              },
              path: "/create",
            });

            setFormData(defaults);
            setFiles([]);
            clearSellDraft();

            if (handleOpenShop) {
              handleOpenShop(user.user);
            }

            toast({
              title: "Submitted",
              description: "Loan request submitted successfully.",
              duration: 5000,
              className: "bg-orange-500 text-white",
            });

            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Loan submission failed:", error);
          toast({
            title: "Submission Failed",
            description: "Please check your form data and try again.",
            duration: 5000,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const canContinue = await checkPostingGateBeforeUpload();
        if (!canContinue) {
          setLoading(false);
          return;
        }

        const { fullUrls, coverThumbUrl } = await uploadFiles();

        const baseData = {
          ...formData,
          imageUrls:
            fullUrls.length > 0 ? fullUrls : Array.isArray(formData.imageUrls) ? formData.imageUrls : [],
          coverThumbUrl: coverThumbUrl || null,
          price: formData["price"]
            ? parseCurrencyToNumber(formData["price"].toString())
            : 0,
          phone,
        };

        const result: any = await createData({
          userId,
          subcategory: selectedSubCategoryId,
          formData: baseData,
          planId: PlanId,
          periodPack: periodInput || activeButtonTitle || "1 month",
          path: "/create",
        });

        if (result?.blocked) {
          saveSellDraft();
          setSubscriptionModalOpen(true);

          toast({
            title: "Subscription required",
            description: "Choose a package to continue posting your ad.",
            duration: 5000,
            className: "bg-red-600 text-white",
          });

          setLoading(false);
          return;
        }

        if (!user?.user?.phone) {
          await updateUserPhone(userId, phone);
        }

        setFormData(defaults);
        setFiles([]);
        setSelectedYear("");
        setPhoneNumber("");
        setSelectedFeatures([]);
        setCoverThumbFile(null);
        setCoverThumbPreview(null);
        clearSellDraft();

        toast({
          title: "Submitted",
          description: "Ad submitted successfully.",
          duration: 5000,
          className: "bg-orange-500 text-white",
        });

        if (handleAdView) {
          handleAdView(result);
        }

        setLoading(false);
        return;
      }

      if (type === "Update") {
        const isValid = await validateForm();
        if (!isValid) {
          setLoading(false);
          return;
        }

        const phone = countryCode + removeLeadingZero(phoneNumber);
        if (!isValidKenyanPhoneNumber(phone)) {
          toast({
            title: "Invalid Phone",
            description: "Invalid Phone Number.",
            duration: 5000,
            className: "bg-[#999999] text-white",
          });
          setLoading(false);
          return;
        }

        const { fullUrls, coverThumbUrl } = await uploadFiles();

        const finalImageUrls =
          fullUrls.length > 0 ? fullUrls : formData.imageUrls || [];

        const finalData = {
          ...formData,
          imageUrls: finalImageUrls,
          coverThumbUrl: coverThumbUrl || formData.coverThumbUrl || null,
          price: formData["price"]
            ? parseCurrencyToNumber(formData["price"].toString())
            : 0,
          phone,
        };

        const _id = ad._id;
        const updatedAd = await updateAd(userId, _id, finalData);

        setFormData(defaults);
        setFiles([]);
        setSelectedYear("");
        setPhoneNumber("");
        setSelectedFeatures([]);
        setCoverThumbFile(null);
        setCoverThumbPreview(null);

        toast({
          title: "Updated",
          description: "Ad updated successfully.",
          duration: 5000,
          className: "bg-orange-500 text-white",
        });

        if (updatedAd && handleAdView) {
          handleAdView(updatedAd);
        }

        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Validation or submission failed", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCategoryCommand) {
    return (
      <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    );
  }

  return (
    <>
      {showload ? (
        <div className="w-full p-5 h-full flex flex-col items-center justify-center">
          <Image
            src="/assets/icons/loading2.gif"
            alt="loading"
            width={40}
            height={40}
            unoptimized
          />
        </div>
      ) : (
        <>
          <div className="p-0 lg:p-2">
            <section className="bg-grey-50 bg-dotted-pattern bg-cover bg-center mb-2 mt-2 rounded-sm">
              <div className="wrapper flex items-center justify-center sm:justify-between">
                <div className="lg:flex-1 p-1 ml-2 mr-5 mb-0 lg:mb-0">
                  <div className="text-lg font-bold breadcrumbs">
                    <h3 className="font-bold text-[25px] text-center sm:text-left">
                      {type} Ad
                    </h3>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col w-full mt-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <CategorySelect
                    selected={selectedCategory}
                    data={selectedCategoryCommand}
                    onChange={handleInputCategoryChange}
                  />
                  {formErrors["category"] && (
                    <p className="text-red-500 text-sm">{formErrors["category"]}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <SubCategorySelect
                    selected={selectedSubCategory}
                    data={selectedCategory ? filteredSubcategories : []}
                    onChange={handleInputSubCategoryChange}
                  />
                  {formErrors["subcategory"] && (
                    <p className="text-red-500 text-sm">{formErrors["subcategory"]}</p>
                  )}
                </div>
              </div>

              {selectedSubCategory &&
                ![
                  "Services",
                  "Jobs",
                  "Repair & Construction",
                  "Buyer Requests",
                  "Seeking Work CVs",
                  "Donations",
                  "Lost and Found",
                ].includes(selectedCategory) && (
                  <div className="mb-4 mt-2">
                    <div className="flex gap-2 items-center">
                      <label className="font-semibold text-sm">Enable Bidding?</label>
                      <BiddingCheckbox
                        handlePayNow={handlePay}
                        formData={formData}
                        setFormData={setFormData}
                        user={user}
                      />
                    </div>

                    {formData.biddingEnabled && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium">
                            Bid Increment (Ksh)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={formData.bidIncrement || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                bidIncrement: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded border p-2 text-sm"
                            placeholder="Enter bid increment e.g. 500"
                          />
                          {formErrors_.bidIncrement && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors_.bidIncrement}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium">
                            Bidding Ends At
                          </label>
                          <input
                            type="datetime-local"
                            value={
                              formData.biddingEndsAt
                                ? new Date(formData.biddingEndsAt)
                                  .toISOString()
                                  .slice(0, 16)
                                : ""
                            }
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                biddingEndsAt: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded border p-2 text-sm"
                          />
                          {formErrors_.biddingEndsAt && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors_.biddingEndsAt}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {selectedSubCategory && !isFinancing && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                  <div>
                    <AutoComplete
                      data={REGIONS_WITH_AREA.map((county) => county.region)}
                      name="region"
                      onChange={handleCounty}
                      selected={formData["region"] || ""}
                    />
                    {formErrors["region"] && (
                      <p className="text-red-500 text-sm">{formErrors["region"]}</p>
                    )}
                  </div>

                  <div>
                    <AutoComplete
                      data={constituencies ?? []}
                      name="area"
                      onChange={handleConstituency}
                      selected={formData["area"] || ""}
                    />
                    {formErrors["area"] && (
                      <p className="text-red-500 text-sm">{formErrors["area"]}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedSubCategory && selectedCategory !== "Buyer Requests" && (
                <div className="flex bg-white w-full mt-3 gap-0 border dark:bg-[#2D3236] py-2 px-1 rounded-sm border-gray-300 dark:border-gray-600 items-center">
                  <FileUploader
                    onFieldChange={(urls) => handleInputChange("imageUrls", urls)}
                    imageUrls={formData["imageUrls"] || []}
                    setFiles={setFiles}
                    adId={adId || ""}
                    userName={userName}
                    category={selectedCategory}
                    anayze={anayze}
                    onCoverThumbChange={(file, previewUrl) => {
                      setCoverThumbFile(file);
                      setCoverThumbPreview(previewUrl);
                    }}
                  />
                  {formErrors["imageUrls"] && (
                    <p className="text-red-500 text-sm">{formErrors["imageUrls"]}</p>
                  )}
                </div>
              )}

              {fields.map((field: Field) => (
                <div key={field.name} className="flex gap-3 items-center mt-3">
                  {field.type === "checkbox" && (
                    <div className="mt-3 mb-3">
                      {capitalizeFirstLetter(field.name.replace("-", " "))}
                    </div>
                  )}

                  {field.type === "related-autocompletes" && (
                    <MakeModelAutocomplete
                      plainTextData={field.options}
                      make={formData["make"] || ""}
                      formErrorsmake={formErrors["make"]}
                      model={formData["model"] || ""}
                      formErrorsmodel={formErrors["model"]}
                      onChange={handleInputAutoCompleteChange}
                    />
                  )}

                  {field.type === "text" && (
                    <TextField
                      required={field.required}
                      id={field.name}
                      label={capitalizeFirstLetter(field.name.replace("-", " "))}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      variant="outlined"
                      placeholder={`Enter ${field.name.replace("-", " ")}`}
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-orange-500 dark:text-orange-400",
                        },
                      }}
                      className="w-full"
                    />
                  )}

                  {field.type === "youtube-link" && (
                    <TextField
                      required={field.required}
                      id={field.type}
                      label="YouTube link"
                      value={formData[field.type] || ""}
                      onChange={(e) => handleInputChange(field.type, e.target.value)}
                      variant="outlined"
                      placeholder="Enter YouTube link"
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-orange-500 dark:text-orange-400",
                        },
                      }}
                      className="w-full"
                    />
                  )}

                  {field.type === "virtualTourLink" && (
                    <TextField
                      required={field.required}
                      id={field.type}
                      label="3D Virtual Property Tour Link"
                      value={formData[field.type] || ""}
                      onChange={(e) => handleInputChange(field.type, e.target.value)}
                      variant="outlined"
                      placeholder="Enter 3D Virtual Property Tour Link"
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-orange-500 dark:text-orange-400",
                        },
                      }}
                      className="w-full"
                    />
                  )}

                  {field.type === "price" && (
                    <div className="flex flex-col w-full">
                      <TextField
                        required={field.required}
                        id={field.name}
                        label={capitalizeFirstLetter(field.name)}
                        value={formatToCurrency(formData[field.name] ?? 0)}
                        onChange={(e) => handleInputChangeMoney(field.name, e.target.value)}
                        variant="outlined"
                        placeholder={`Enter ${field.name.replace("-", " ")}`}
                        InputProps={{
                          classes: {
                            root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                            notchedOutline: "border-gray-300 dark:border-gray-600",
                            focused: "",
                          },
                        }}
                        InputLabelProps={{
                          classes: {
                            root: "text-gray-500 dark:text-gray-400",
                            focused: "text-orange-500 dark:text-orange-400",
                          },
                        }}
                        className="w-full"
                      />

                      <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border w-full">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                          Are you open to negotiation?
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          {["Yes", "No", "Not sure"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="negotiable"
                                value={option.toLowerCase()}
                                checked={
                                  formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                }
                                onChange={() =>
                                  handleInputChange("negotiable", option.toLowerCase())
                                }
                                className="hidden peer"
                              />
                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-orange-500 peer-checked:ring-2 peer-checked:ring-orange-400 flex items-center justify-center">
                                {(formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure") && (
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                                  )}
                              </div>
                              <span
                                className={
                                  (formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure")
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-600 dark:text-gray-400"
                                }
                              >
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {field.type === "rentprice" && (
                    <div className="flex flex-col w-full">
                      <div className="flex w-full gap-1">
                        <TextField
                          required={field.required}
                          id="price"
                          label={capitalizeFirstLetter("price")}
                          value={formatToCurrency(formData["price"] ?? 0)}
                          onChange={(e) => handleInputChangeMoney("price", e.target.value)}
                          variant="outlined"
                          placeholder="Enter Price"
                          InputProps={{
                            classes: {
                              root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                              notchedOutline: "border-gray-300 dark:border-gray-600",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-gray-500 dark:text-gray-400",
                              focused: "text-orange-500 dark:text-orange-400",
                            },
                          }}
                          className="w-full"
                        />

                        <select
                          className="bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border w-[140px] lg:w-[200px]"
                          value={formData["period"] || ""}
                          onChange={(e) => handleInputChange("period", e.target.value)}
                        >
                          <option value="per month">per month</option>
                          <option value="per day">per day</option>
                          <option value="per quarter-year">per quarter-year</option>
                          <option value="per half-year">per half-year</option>
                          <option value="per year">per year</option>
                        </select>
                      </div>

                      <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border w-full">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                          Are you open to negotiation?
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          {["Yes", "No", "Not sure"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="negotiable"
                                value={option.toLowerCase()}
                                checked={
                                  formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                }
                                onChange={() =>
                                  handleInputChange("negotiable", option.toLowerCase())
                                }
                                className="hidden peer"
                              />
                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-orange-500 peer-checked:ring-2 peer-checked:ring-orange-400 flex items-center justify-center">
                                {(formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure") && (
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                                  )}
                              </div>
                              <span
                                className={
                                  (formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure")
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-600 dark:text-gray-400"
                                }
                              >
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {field.type === "priceper" && (
                    <div className="flex flex-col w-full">
                      <div className="flex w-full gap-1">
                        <TextField
                          required={field.required}
                          id="price"
                          label={capitalizeFirstLetter("price")}
                          value={formatToCurrency(formData["price"] ?? 0)}
                          onChange={(e) => handleInputChangeMoney("price", e.target.value)}
                          variant="outlined"
                          placeholder="Enter Price"
                          InputProps={{
                            classes: {
                              root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                              notchedOutline: "border-gray-300 dark:border-gray-600",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-gray-500 dark:text-gray-400",
                              focused: "text-orange-500 dark:text-orange-400",
                            },
                          }}
                          className="w-full"
                        />

                        <select
                          className="bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border w-[140px] lg:w-[200px]"
                          value={formData["per"] || "Outright Price"}
                          onChange={(e) => handleInputChange("per", e.target.value)}
                        >
                          <option value="Outright Price">Outright Price...</option>
                          <option value="per acre">per acre</option>
                          <option value="per plot">per plot</option>
                          <option value="per SqF">per SqF</option>
                        </select>
                      </div>

                      <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border w-full">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                          Are you open to negotiation?
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          {["Yes", "No", "Not sure"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="negotiable"
                                value={option.toLowerCase()}
                                checked={
                                  formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                }
                                onChange={() =>
                                  handleInputChange("negotiable", option.toLowerCase())
                                }
                                className="hidden peer"
                              />
                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-orange-500 peer-checked:ring-2 peer-checked:ring-orange-400 flex items-center justify-center">
                                {(formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure") && (
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                                  )}
                              </div>
                              <span
                                className={
                                  (formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure")
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-600 dark:text-gray-400"
                                }
                              >
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {field.type === "bulkprice" && (
                    <div className="flex flex-col w-full">
                      <div className="flex w-full gap-1">
                        <TextField
                          required={field.required}
                          id="price"
                          label={capitalizeFirstLetter("price")}
                          value={formatToCurrency(formData["price"] ?? 0)}
                          onChange={(e) => handleInputChangeMoney("price", e.target.value)}
                          variant="outlined"
                          placeholder="Enter Price"
                          InputProps={{
                            classes: {
                              root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                              notchedOutline: "border-gray-300 dark:border-gray-600",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-gray-500 dark:text-gray-400",
                              focused: "text-orange-500 dark:text-orange-400",
                            },
                          }}
                          className="w-full"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPopupBulk(true)}
                          className="py-3 text-sm lg:text-base w-[200px] px-1 rounded-sm border border-orange-500 text-orange-500 hover:bg-orange-100"
                        >
                          <AddOutlinedIcon /> Add Bulk Price
                        </button>

                        {showPopupBulk && (
                          <BulkPriceManager
                            selected={formData["bulkprice"] || []}
                            name="bulkprice"
                            onChange={handleInputAutoCompleteChange}
                            handleClosePopupBulk={() => setShowPopupBulk(false)}
                          />
                        )}
                      </div>

                      <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border w-full">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                          Are you open to negotiation?
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          {["Yes", "No", "Not sure"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="negotiable"
                                value={option.toLowerCase()}
                                checked={
                                  formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                }
                                onChange={() =>
                                  handleInputChange("negotiable", option.toLowerCase())
                                }
                                className="hidden peer"
                              />
                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-orange-500 peer-checked:ring-2 peer-checked:ring-orange-400 flex items-center justify-center">
                                {(formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure") && (
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                                  )}
                              </div>
                              <span
                                className={
                                  (formData["negotiable"]
                                    ? formData["negotiable"] === option.toLowerCase()
                                    : option.toLowerCase() === "not sure")
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-600 dark:text-gray-400"
                                }
                              >
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {field.type === "serviceprice" && (
                    <div className="flex w-full gap-1">
                      <PriceInput
                        priceType_={formData["contact"] || "specify"}
                        unit_={formData["unit"] || "per service"}
                        negotiable_={formData["negotiable"] || "not sure"}
                        onChange={handleInputAutoCompleteChange}
                        price_={formData["price"] || ""}
                      />
                    </div>
                  )}

                  {field.type === "number" && (
                    <TextField
                      required={field.required}
                      id={field.name}
                      label={capitalizeFirstLetter(field.name.replace("-", " "))}
                      value={formData[field.name] || 0}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      variant="outlined"
                      placeholder={`Enter ${field.name.replace("-", " ")}`}
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-orange-500 dark:text-orange-400",
                        },
                      }}
                      className="w-full"
                    />
                  )}

                  {field.type === "money" && (
                    <TextField
                      required={field.required}
                      id={field.name}
                      label={capitalizeFirstLetter(field.name.replace("-", " "))}
                      value={formatToCurrency(formData[field.name] ?? 0)}
                      onChange={(e) => handleInputChangeMoney(field.name, e.target.value)}
                      variant="outlined"
                      placeholder={`Enter ${field.name.replace("-", " ")}`}
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-orange-500 dark:text-orange-400",
                        },
                      }}
                      className="w-full"
                    />
                  )}

                  {field.type === "select" && (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#4B5563",
                          },
                          "&:hover fieldset": {
                            borderColor: "#2563EB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2563EB",
                          },
                        },
                      }}
                      className="rounded-md dark:border-gray-600"
                    >
                      <InputLabel className="font-medium text-gray-500 dark:text-gray-400">
                        {capitalizeFirstLetter(field.name.replace("-", " "))}
                        {field.required && <>*</>}
                      </InputLabel>
                      <Select
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={field.required}
                        label={capitalizeFirstLetter(field.name.replace("-", " "))}
                        className="dark:text-gray-100 dark:bg-[#2D3236] bg-white"
                      >
                        {field.options?.map((option: any) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {field.type === "year" && (
                    <AutoComplete
                      data={years}
                      name={field.name}
                      onChange={handleInputYearChange}
                      selected={formData[field.name] || ""}
                    />
                  )}

                  {field.type === "autocomplete" && (
                    <AutoComplete
                      data={field.options || []}
                      name={field.name}
                      onChange={handleInputAutoCompleteChange}
                      selected={formData[field.name] || ""}
                    />
                  )}

                  {field.type === "multi-select" && (
                    <div className="w-full flex py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 flex-wrap gap-2 dark:bg-[#2D3236] bg-white">
                      <Multiselect
                        features={field.options}
                        name={field.name}
                        selectedFeatures={formData[field.name] || []}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                  )}

                  {field.type === "radio" && (
                    <div className="w-full flex py-2 px-3 rounded-sm border border-gray-300 dark:border-gray-600 flex-wrap gap-2 dark:bg-[#2D3236] bg-white">
                      <FormControl>
                        <FormLabel className="text-gray-800 dark:text-gray-200">
                          {capitalizeFirstLetter(field.name.replace("-", " "))}
                        </FormLabel>
                        <RadioGroup
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="space-y-0"
                        >
                          {field.options?.map((option: any, index: number) => (
                            <FormControlLabel
                              key={index}
                              value={option}
                              control={
                                <Radio
                                  sx={{
                                    color: "gray",
                                    "&.Mui-checked": {
                                      color: "orange",
                                    },
                                  }}
                                />
                              }
                              label={option}
                              className="text-gray-800 dark:text-gray-200"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  )}

                  {field.type === "checkbox" &&
                    field.options?.map((option: any, index: number) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option}
                          onChange={() => handleCheckboxChange(field.name, option)}
                        />
                        {option}
                      </label>
                    ))}

                  {field.type === "textarea" && (
                    <div className="border border-gray-300 p-1 bg-white rounded-sm w-full">
                      <div
                        style={{
                          width: "100%",
                          height: "300px",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <ReactQuill
                          value={formData[field.name] || ""}
                          theme="snow"
                          onChange={(value) => handleInputChange(field.name, value)}
                          modules={modules}
                          placeholder={`Enter ${capitalizeFirstLetter(
                            field.name.replace("-", " ")
                          )}*`}
                          style={{
                            height: "100%",
                            width: "100%",
                            border: "0px",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {field.type === "phone" && (
                    <div className="flex w-full flex-col">
                      <div className="flex w-full gap-1">
                        {user?.user?.phone ? (
                          <>
                            <TextField
                              required={field.required}
                              id={field.name}
                              disabled
                              label={`${capitalizeFirstLetter(field.name)} (Verified)`}
                              type="tel"
                              value={`${user?.user?.phone || ""}`}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                                classes: {
                                  root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                                  notchedOutline: "border-green-500",
                                  focused: "",
                                },
                              }}
                              InputLabelProps={{
                                classes: {
                                  root: "text-green-600 dark:text-green-400",
                                  focused: "text-green-600 dark:text-green-400",
                                },
                              }}
                              className="w-full"
                            />
                            <p className="flex lg:w-[150px] text-green-600 text-sm mt-1">
                              ✅ Phone verified
                            </p>
                          </>
                        ) : (
                          <div className="p-0 w-full">
                            <h1 className="text-xl font-bold mb-4">Verify Your Phone</h1>
                            <PhoneVerification onVerified={handleVerified} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {field.type === "delivery" && (
                    <div className="flex flex-col w-full gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPopup(true)}
                        className="py-3 w-full px-1 rounded-sm border border-orange-500 text-orange-500 hover:bg-orange-100"
                      >
                        <AddOutlinedIcon /> Add Delivery Option
                      </button>

                      {showPopup && (
                        <DeliveryOptions
                          name="delivery"
                          subcategory={selectedSubCategory || ""}
                          onChange={handleInputOnChange}
                          selected={formData["delivery"] || []}
                          onSave={() => setShowPopup(false)}
                        />
                      )}
                    </div>
                  )}

                  {field.type === "notify" && (
                    <label className="flex items-center mt-2 mb-2 gap-2 dark:text-gray-400 text-orange-500 text-sm">
                      <BellIcon className="w-4 h-4" />
                      {field.options}
                    </label>
                  )}

                  {formErrors[field.name] && (
                    <p className="text-red-500 text-sm">{formErrors[field.name]}</p>
                  )}
                </div>
              ))}

              {type === "Create" &&
                selectedCategory !== "Donations" &&
                selectedCategory !== "Lost and Found" &&
                selectedCategory !== "Buyer Requests" &&
                selectedSubCategory && (
                  <div className="rounded-lg mt-4 p-0">
                    <div className="w-full mt-2 p-0 dark:text-gray-100 rounded-lg">
                      <div className="flex flex-col mb-5">
                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-xl">
                          Boost your ad
                        </p>
                        <p className="text-gray-600 text-sm dark:text-gray-500">
                          Choose a boost type for your ad
                        </p>
                      </div>

                      <div className="w-full">
                        {packagesList.length > 0 &&
                          packagesList
                            .filter(
                              (pack: any) =>
                                !(
                                  selectedSubCategory.toLowerCase() ===
                                  "assets financing" && pack.name === "Free"
                                )
                            )
                            .map((pack: Package, index: number) => {
                              const isSamePackage = Plan === pack.name;
                              const prices = getPackagePrices(pack);

                              return (
                                <div
                                  key={index}
                                  className={`mb-2 dark:bg-[#2D3236] border bg-white rounded-lg cursor-pointer ${activePackage?._id === pack._id
                                    ? "bg-[#F2FFF2] border-orange-600 border-2"
                                    : ""
                                    }`}
                                >
                                  <div
                                    onClick={() => handleClick(pack)}
                                    className="flex justify-between items-center w-full"
                                  >
                                    <div className="p-3">
                                      <p className="text-gray-700 font-semibold dark:text-gray-300">
                                        {pack.name}
                                      </p>
                                      <ul className="flex flex-col gap-1 p-1">
                                        {(pack.features || [])
                                          .slice(0, 1)
                                          .map((feature: any, i: number) => (
                                            <li key={i} className="flex items-center gap-1">
                                              <DoneOutlinedIcon />
                                              <p className="text-sm">
                                                {typeof feature === "string"
                                                  ? feature
                                                  : feature?.title}
                                              </p>
                                            </li>
                                          ))}
                                      </ul>
                                    </div>

                                    <div className="p-3">
                                      <div className="text-gray-600 mb-1">
                                        <div className="flex gap-2 text-sm">
                                          {daysRemaining > 0 && pack.name === Plan && (
                                            <div className="p-1 flex-block rounded-full bg-orange-500">
                                              <p className="text-white text-xs">Active</p>
                                            </div>
                                          )}
                                          {pack.name === "Free" &&
                                            isSamePackage &&
                                            remainingAds > 0 && (
                                              <div className="p-1 flex-block rounded-full bg-orange-500">
                                                <p className="text-white text-xs">Active</p>
                                              </div>
                                            )}
                                        </div>
                                      </div>

                                      <div className="text-center">
                                        {pack.name !== "Free" && (
                                          <div className="text-gray-800 font-bold mb-0">
                                            <ul className="flex flex-col items-center gap-0 py-0">
                                              {prices.map((price: any, i: number) => (
                                                <li
                                                  key={i}
                                                  className={`flex items-center gap-0 ${i !== activeButton ? "hidden" : ""
                                                    }`}
                                                >
                                                  <p
                                                    className={`font-semibold ${activePackage?._id === pack._id
                                                      ? "text-orange-500"
                                                      : "text-gray-800 dark:text-gray-400"
                                                      }`}
                                                  >
                                                    Ksh{" "}
                                                    {Number(price.amount).toLocaleString()}/{" "}
                                                    {activeButtonTitle.trim()}
                                                  </p>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {pack.name !== "Free" && activePackage?._id === pack._id && (
                                    <div className="flex flex-wrap justify-end items-center p-2">
                                      {selectedSubCategory !== "Assets Financing" && (
                                        <button
                                          type="button"
                                          className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 0
                                            ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                            : "border border-orange-500 text-orange-500 rounded-full p-2"
                                            }`}
                                          onClick={() => handleButtonClick(0, "1 week")}
                                        >
                                          1 week
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 1
                                          ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                          : "border border-orange-500 text-orange-500 rounded-full p-2"
                                          }`}
                                        onClick={() => handleButtonClick(1, "1 month")}
                                      >
                                        1 month
                                      </button>

                                      <button
                                        type="button"
                                        className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 2
                                          ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                          : "border border-orange-500 text-orange-500 rounded-full p-2"
                                          }`}
                                        onClick={() => handleButtonClick(2, "3 months")}
                                      >
                                        3 months
                                      </button>

                                      <button
                                        type="button"
                                        className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 3
                                          ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                          : "border border-orange-500 text-orange-500 rounded-full p-2"
                                          }`}
                                        onClick={() => handleButtonClick(3, "6 months")}
                                      >
                                        6 months
                                      </button>

                                      <button
                                        type="button"
                                        className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 4
                                          ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                          : "border border-orange-500 text-orange-500 rounded-full p-2"
                                          }`}
                                        onClick={() => handleButtonClick(4, "1 year")}
                                      >
                                        1 year
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                      </div>
                    </div>
                  </div>
                )}

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="py-3 w-full px-1 mt-2 items-center justify-center rounded-sm hover:bg-gray-900 bg-black text-white"
              >
                <div className="flex w-full justify-center gap-1 items-center">
                  {loading && <CircularProgress size={18} sx={{ color: "#fff" }} />}
                  {loading ? "Submitting..." : `${type} Ad`}
                </div>
              </button>

              <p className="mt-3 mb-10 text-xs text-gray-600 dark:text-gray-500 text-center">
                By clicking on Create Ad, you accept the{" "}
                <span
                  onClick={() => router.push("/terms")}
                  className="text-orange-500 cursor-pointer underline"
                >
                  Terms of Use
                </span>
              </p>
            </div>
          </div>

          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
              <div className="justify-center items-center dark:text-gray-300 rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col">
                <div className="flex gap-1 text-[#D1D5DB] items-center">
                  <CircularProgress sx={{ color: "#D1D5DB" }} />
                  {type === "Update" ? "Updating Ad..." : "Creating Ad..."}
                  {uploadProgress > 0 ? ` ${uploadProgress}%` : ""}
                </div>
              </div>
            </div>
          )}

          <SubscriptionRequiredModal
            open={subscriptionModalOpen}
            onClose={() => setSubscriptionModalOpen(false)}
            packagesList={packagesList || []}
            userId={userId}
            user={user}
            daysRemaining={daysRemaining}
            packname={Plan}
          />
        </>
      )}
    </>
  );
};

export default AdForm;