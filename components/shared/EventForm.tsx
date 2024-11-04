"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IAd } from "@/lib/database/models/ad.model";
import { AdFormSchema } from "@/lib/validator";
import CircularProgress from "@mui/material/CircularProgress";

import {
  AdDefaultValues,
  BusesMake,
  amenities,
  automotivePartsCategories,
  automotivePartsMakes,
  bathrooms,
  bedrooms,
  boatTypes,
  businessType,
  constructionStatus,
  equipmentMakes,
  equipmentTypes,
  floors,
  furnishing,
  interiorVehicleColors,
  motorcycleMakes,
  propertyCondition,
  propertyFeature,
  propertyType,
  truckMakes,
  truckTypes,
  //  units,
  vehicleBodyTypes,
  vehicleColors,
  vehicleConditions,
  vehicleFeatures,
  vehicleFuelTypes,
  vehicleModels,
  vehicleRegistered,
  vehicleSeats,
  vehicleSecondConditions,
  vehicleTransmissions,
  yesno,
} from "@/constants";
import "react-datepicker/dist/react-datepicker.css";
import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { useUploadThing } from "@/lib/uploadthing";
import { createAd, updateAd } from "@/lib/actions/ad.actions";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

import React from "react";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { FileUploader } from "./FileUploader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addModelToMake } from "./addModelToMake";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

type Package = {
  imageUrl: string;
  name: string;
  _id: string;
  description: string;
  price: string[];
  features: string[];
  color: string;
  priority: number;
};
type AdFormProps = {
  userId: string;
  planId: string;
  type: string;
  ad?: IAd;
  adId?: string;
  userName: string;
  daysRemaining: number;
  packname: string;
  packagesList: any;
  listed: number;
  priority: number;
  expirationDate: Date;
  adstatus: string;
};

const AdForm = ({
  userId,
  planId,
  type,
  ad,
  adId,
  userName,
  daysRemaining,
  packname,
  packagesList,
  listed,
  priority,
  expirationDate,
  adstatus,
}: AdFormProps) => {
  const initialValues =
    ad && type === "Update"
      ? {
          ...ad,
        }
      : AdDefaultValues;
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const form = useForm<z.infer<typeof AdFormSchema>>({
    resolver: zodResolver(AdFormSchema),
    defaultValues: initialValues,
  });
  const { startUpload } = useUploadThing("imageUploader");
  let uploadedImageUrl: string[] = [];
  interface Location {
    latitude: number;
    longitude: number;
    address: string;
  }
  const [location, setLocation] = useState<Location | null>(null);

  const [selectedOption, setSelectedOption] = useState("search");

  const [myaddress, setAddress] = useState("");
  const [SelectedCategory, SetselectedCategory] = useState(
    ad?.subcategory ?? ""
  );
  // Define custom toolbar options
  //const modules = {
  //  toolbar: [
  //    [{ header: "1" }, { header: "2" }, { font: [] }],
  //   [{ size: ["small", false, "large", "huge"] }], // Font size options
  //   [{ list: "ordered" }, { list: "bullet" }],
  //   ["bold", "italic", "underline", "strike", "blockquote"],
  //    [{ color: [] }, { background: [] }], // Color options
  //    [{ align: [] }],
  //    ["link", "image"],
  //    ["clean"],
  //   ],
  // };
  const [categories, setCategories] = useState<ICategory[]>([]);
  //errors
  const [showmessage, setmessage] = useState("");
  const [errormake, seterrormake] = useState("");
  const [errorprice, seterrorprice] = useState("");
  const [errormodel, seterrormodel] = useState("");

  const [errorvehicleyear, seterrorvehicleyear] = useState("");
  const [errorvehiclecolor, seterrorvehiclecolor] = useState("");

  const [errorvehicleinteriorColor, seterrorvehicleinteriorColor] =
    useState("");
  const [errorvehiclecondition, seterrorvehiclecondition] = useState("");

  const [errorvehiclesecordCondition, seterrorvehiclesecordCondition] =
    useState("");
  const [errorvehicleTransmissions, seterrorvehicleTransmissions] =
    useState("");
  const [errorvehiclemileage, seterrorvehiclemileage] = useState("");
  const [errorvehiclekeyfeatures, seterrorvehiclekeyfeatures] = useState("");
  const [errorvehiclechassis, seterrorvehiclechassis] = useState("");
  const [errorvehicleregistered, seterrorvehicleregistered] = useState("");
  const [errorvehicleexchangeposible, seterrorvehicleexchangeposible] =
    useState("");
  const [errorvehicleBodyTypes, seterrorvehicleBodyTypes] = useState("");
  const [errorvehicleFuelTypes, seterrorvehicleFuelTypes] = useState("");
  const [errorvehicleSeats, seterrorvehicleSeats] = useState("");
  const [errorvehicleEngineSizesCC, seterrorvehicleEngineSizesCC] =
    useState("");
  const [errorTypes, seterrorTypes] = useState("");
  const [Adstatus_, setadstatus] = useState(adstatus);
  const [Priority_, setpriority] = useState(priority);
  const [ExpirationDate_, setexpirationDate] = useState(expirationDate);

  async function getAddressFromCoordinates(
    latitude: string,
    longitude: string
  ) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const address = data.display_name;
        return address;
      } else {
        throw new Error(data.error || "Failed to fetch address");
      }
    } catch (error) {
      console.error("Error fetching address");
      return null;
    }
  }
  const parseCurrencyToNumber = (value: string): number => {
    // Remove any commas from the string and convert to number
    return Number(value.replace(/,/g, ""));
  };
  async function onSubmit(values: z.infer<typeof AdFormSchema>) {
    uploadedImageUrl = values.imageUrls;

    try {
      if (
        form.getValues("make") === "" &&
        (SelectedCategory === "Cars, Vans & Pickups" ||
          SelectedCategory === "Buses & Microbuses" ||
          SelectedCategory === "Motorbikes,Tuktuks & Scooters" ||
          SelectedCategory === "Heavy Equipment" ||
          SelectedCategory === "Trucks & Trailers" ||
          SelectedCategory === "Vehicle Parts & Accessories")
      ) {
        seterrormake("Please! Select Make");
        return;
      }
      if (
        form.getValues("vehiclemodel") === "" &&
        SelectedCategory === "Cars, Vans & Pickups"
      ) {
        seterrormodel("Please! Select Model");
        return;
      }

      if (
        form.getValues("vehicleyear") === "" &&
        (SelectedCategory === "Cars, Vans & Pickups" ||
          SelectedCategory === "Buses & Microbuses" ||
          SelectedCategory === "Motorbikes,Tuktuks & Scooters" ||
          SelectedCategory === "Heavy Equipment" ||
          SelectedCategory === "Trucks & Trailers" ||
          SelectedCategory === "Watercraft & Boats")
      ) {
        seterrorvehicleyear("Please! Select Year");
        return;
      }
      if (
        form.getValues("Types") === "" &&
        (SelectedCategory === "Heavy Equipment" ||
          SelectedCategory === "Trucks & Trailers" ||
          SelectedCategory === "Vehicle Parts & Accessories" ||
          SelectedCategory === "Watercraft & Boats")
      ) {
        seterrorTypes("Please! Select Type");
        return;
      }

      // if (
      //  form.getValues("vehicleinteriorColor") === "" &&
      //  SelectedCategory === "Cars, Vans & Pickups"
      // ) {
      //  seterrorvehicleinteriorColor("Please! Select Vehicle interior color");
      // return;
      // }
      if (
        form.getValues("vehiclecondition") === "" &&
        (SelectedCategory === "Cars, Vans & Pickups" ||
          SelectedCategory === "Buses & Microbuses" ||
          SelectedCategory === "Motorbikes,Tuktuks & Scooters" ||
          SelectedCategory === "Heavy Equipment" ||
          SelectedCategory === "Trucks & Trailers" ||
          SelectedCategory === "Vehicle Parts & Accessories" ||
          SelectedCategory === "Watercraft & Boats")
      ) {
        seterrorvehiclecondition("Please! Select Condition");
        return;
      }
      //iiii

      // if (
      // form.getValues("vehiclesecordCondition") === "" &&
      // SelectedCategory === "Cars, Vans & Pickups"
      //) {
      //  seterrorvehiclesecordCondition(
      // "Please! Select Vehicle secord condition"
      // );
      // return;
      // }
      //  if (
      // form.getValues("vehicleTransmissions") === "" &&
      //  SelectedCategory === "Cars, Vans & Pickups"
      //) {
      // seterrorvehicleTransmissions("Please! Select Vehicle Transmissions");
      // return;
      //}
      // if (
      //   form.getValues("vehiclemileage") === "" &&
      //   SelectedCategory === "Cars, Vans & Pickups"
      // ) {
      //   seterrorvehiclemileage("Please! Select Mileage");
      //   return;
      //   }
      // if (
      //   form.getValues("vehiclekeyfeatures")?.length === 0 &&
      //  SelectedCategory === "Cars, Vans & Pickups"
      // ) {
      //   seterrorvehiclekeyfeatures("Please! Select Vehicle key features");
      //  return;
      // }
      //  if (
      //   form.getValues("vehiclechassis") === "" &&
      //   SelectedCategory === "Cars, Vans & Pickups"
      // ) {
      //  seterrorvehiclechassis("Please! Select Vehicle VIN Chassis number");
      //  return;
      // }
      if (
        form.getValues("vehicleregistered") === "" &&
        (SelectedCategory === "Cars, Vans & Pickups" ||
          SelectedCategory === "Buses & Microbuses")
      ) {
        seterrorvehicleregistered("Please! Select Registration status");
        return;
      }
      //  if (
      //    form.getValues("vehicleexchangeposible") === "" &&
      //    SelectedCategory === "Cars, Vans & Pickups"
      //  ) {
      //   seterrorvehicleexchangeposible(
      //     "Please! Select Vehicle exchange status"
      //   );
      //  return;
      //   }
      if (
        form.getValues("vehicleBodyTypes") === "" &&
        SelectedCategory === "Cars, Vans & Pickups"
      ) {
        seterrorvehicleBodyTypes("Please! Select body type");
        return;
      }
      if (
        form.getValues("vehicleFuelTypes") === "" &&
        (SelectedCategory === "Cars, Vans & Pickups" ||
          SelectedCategory === "Buses & Microbuses")
      ) {
        seterrorvehicleFuelTypes("Please! Select Fuel Type");
        return;
      }
      // if (
      //    form.getValues("vehicleSeats") === "" &&
      //    SelectedCategory === "Cars, Vans & Pickups"
      // ) {
      //  seterrorvehicleSeats("Please! Select Vehicle Seats No");
      //  return;
      //  }
      if (
        form.getValues("vehicleEngineSizesCC") === "" &&
        SelectedCategory === "Cars, Vans & Pickups"
      ) {
        seterrorvehicleEngineSizesCC("Please! Select Vehicle Engine Size CC");
        return;
      }
      //  if (form.getValues("price") === "" ) {
      //    seterrorprice("Please! Enter Price!");
      //    return;
      //  }

      if (files.length > 10) {
        setmessage("Please upload maximum of 10 images");
        return;
      }

      if (files.length > 0) {
        // Upload all files concurrently

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            //  console.log("fileName- " + file.name);
            const uploadedImages = await startUpload([file]);
            if (uploadedImages && uploadedImages.length > 0) {
              // Push the URL to the corresponding index in uploadedImageUrl array
              uploadedImageUrl.push(uploadedImages[0].url);
              setUploadProgress(Math.round(((1 + i) / files.length) * 100));
              // console.log("push- " + uploadedImages[0].url);
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }
      }

      if (type === "Create") {
        uploadedImageUrl = uploadedImageUrl.filter(
          (url) => !url.includes("blob:")
        );
        if (
          form.getValues("latitude") &&
          form.getValues("longitude") &&
          selectedOption === "enter"
        ) {
          try {
            const address = await getAddressFromCoordinates(
              form.getValues("latitude"),
              form.getValues("longitude")
            );

            form.setValue("address", address);
          } catch (error) {
            // console.error("Error:", error);
            form.setValue("address", "Unknown");
          }
        }
        //alert(form.getValues("address"));

        const newAd = await createAd({
          ad: {
            ...values,
            priority: Priority_,
            expirely: ExpirationDate_,
            adstatus: Adstatus_,
            phone: countryCode + removeLeadingZero(phoneNumber),
            price: parseCurrencyToNumber(form.getValues("price").toString()),
            address: form.getValues("address"),
            vehiclekeyfeatures:
              selectedfeaturesOptions.length > 0 ? selectedfeaturesOptions : [],
            vehicleEngineSizesCC: (
              form.getValues("vehicleEngineSizesCC")?.replace(/\s/g, "") ?? ""
            ).toUpperCase(),

            imageUrls: uploadedImageUrl,
            geometry: {
              type: "Point",
              coordinates: [
                parseFloat(form.getValues("longitude")),
                parseFloat(form.getValues("latitude")),
              ], // assuming latitude and longitude are obtained from the form
            },
          },
          userId,
          planId: PlanId,
          pricePack: Number(priceInput),
          periodPack: periodInput,
          path: "/profile",
        });
        if (newAd) {
          form.reset();
          if (newAd.adstatus === "Pending") {
            router.push(`/pay/${newAd._id}`);
          } else {
            router.push(`/ads/${newAd._id}`);
          }
        }
      } else if (type === "Update") {
        if (!adId) {
          router.back();
          return;
        }
        uploadedImageUrl = uploadedImageUrl.filter(
          (url) => !url.includes("blob:")
        );
        if (
          form.getValues("latitude") &&
          form.getValues("longitude") &&
          selectedOption === "enter"
        ) {
          try {
            const address = await getAddressFromCoordinates(
              form.getValues("latitude"),
              form.getValues("longitude")
            );

            form.setValue("address", address);
            //  alert("address:" + address);
          } catch (error) {
            //  console.error("Error:", error);
            form.setValue("address", "Unknown");
          }
        }
        const updatedAd = await updateAd({
          userId,
          planId: PlanId,
          ad: {
            ...values,
            phone: countryCode + removeLeadingZero(phoneNumber),
            price: parseCurrencyToNumber(form.getValues("price").toString()),
            vehiclekeyfeatures:
              selectedfeaturesOptions.length > 0 ? selectedfeaturesOptions : [],
            vehicleEngineSizesCC: (
              form.getValues("vehicleEngineSizesCC")?.replace(/\s/g, "") ?? ""
            ).toUpperCase(),
            address: form.getValues("address"),
            imageUrls: uploadedImageUrl,
            geometry: {
              type: "Point",
              coordinates: [
                parseFloat(form.getValues("longitude")),
                parseFloat(form.getValues("latitude")),
              ], // assuming latitude and longitude are obtained from the form
            },
            _id: adId,
          },
          path: `/ads/${adId}`,
        });

        if (updatedAd) {
          form.reset();
          router.push(`/ads/${updatedAd._id}`);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  // Your existing state variables and functions here
  const [activePackage, setActivePackage] = useState<Package | null>(
    packagesList.length > 0
      ? listed > 0 && packname === "Free"
        ? packagesList[0]
        : packagesList[1]
      : null
  );
  const [activeButton, setActiveButton] = useState(0);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 week");
  const [priceInput, setPriceInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [PlanId, setplanId] = useState(planId);
  //const [packNameInput, setPackNameInput] = useState(
  //   listed > 0 && packname === "Free"
  //     ? packagesList[0].name
  //     : packagesList[1].name
  //);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching categories from the database

    const getCategories = async () => {
      try {
        const categoryList = await getAllCategories();

        categoryList && setCategories(categoryList as ICategory[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
    const youtubeRegex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    function extractYouTubeVideoId(url: string) {
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return match[1]; // Return the video ID
      } else {
        return null; // Not a YouTube URL or invalid URL
      }
    }
    if (type === "Update") {
      if (ad?.youtube) {
        const videoId = extractYouTubeVideoId(ad.youtube);
        if (!videoId) {
          form.setValue(
            "youtube",
            "https://www.youtube.com/watch?v=" + ad.youtube
          ); // lat value
          // console.log("YouTube Video ID:", videoId);
        }
      }
      if (ad?.address) {
        form.setValue("address", ad?.address); // Reset constituency value
        setAddress(ad?.address);
      }
      if (ad?.latitude) {
        form.setValue("latitude", ad?.latitude); // lat value
      }
      if (ad?.longitude) {
        form.setValue("longitude", ad?.longitude); // longitude value
      }
      if (ad?.category) {
        form.setValue("categoryId", ad?.category._id); // longitude value
      }
      if (ad?._id) {
        sessionStorage.setItem("id", ad?._id);
      }
      if (ad?.title) {
        sessionStorage.setItem("title", ad?.title);
      }
      if (ad?.description) {
        sessionStorage.setItem("description", ad?.description);
      }
      //if (ad?.price) {
      //  form.setValue("price", ad?.price.toString()); // longitude value
      //}
    }
    (listed > 0 && packname === "Free"
      ? packagesList[0]
      : packagesList[1]
    ).price.forEach((price: any, index: number) => {
      if (index === activeButton) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();

      categoryList && setCategories(categoryList as ICategory[]);
    };

    getCategories();
    const youtubeRegex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    function extractYouTubeVideoId(url: string) {
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return match[1]; // Return the video ID
      } else {
        return null; // Not a YouTube URL or invalid URL
      }
    }
    if (type === "Update") {
      if (ad?.youtube) {
        const videoId = extractYouTubeVideoId(ad.youtube);
        if (!videoId) {
          form.setValue(
            "youtube",
            "https://www.youtube.com/watch?v=" + ad.youtube
          ); // lat value
          // console.log("YouTube Video ID:", videoId);
        }
      }
      if (ad?.address) {
        form.setValue("address", ad?.address); // Reset constituency value
        setAddress(ad?.address);
      }
      if (ad?.latitude) {
        form.setValue("latitude", ad?.latitude); // lat value
      }
      if (ad?.longitude) {
        form.setValue("longitude", ad?.longitude); // longitude value
      }
      if (ad?.category) {
        form.setValue("categoryId", ad?.category._id); // longitude value
      }
      if (ad?._id) {
        sessionStorage.setItem("id", ad?._id);
      }
      if (ad?.title) {
        sessionStorage.setItem("title", ad?.title);
      }
      if (ad?.description) {
        sessionStorage.setItem("description", ad?.description);
      }
      //if (ad?.price) {
      //  form.setValue("price", ad?.price.toString()); // longitude value
      //}
    }
    (listed > 0 && packname === "Free"
      ? packagesList[0]
      : packagesList[1]
    ).price.forEach((price: any, index: number) => {
      if (index === activeButton) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  }, []);

  const handleSelect = (e: any) => {
    // alert("-c " + ad?.address);
    form.setValue("address", e.value.description); // Reset constituency value
    geocodeByAddress(e.value.description)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        form.setValue("latitude", lat.toString()); // lat value
        form.setValue("longitude", lng.toString()); // lng value
      });
  };

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const handleLongitudeChange = (event: any) => {
    // setSelectedOption(event.target.value);
    form.setValue("longitude", event.target.value.toString()); // longitude value
  };
  const handleLatitudeChange = (event: any) => {
    // setSelectedOption(event.target.value);
    form.setValue("latitude", event.target.value.toString()); // lat value
  };

  const [countryCode, setCountryCode] = useState(
    ad?.phone.substring(0, 4) ?? "+254"
  ); // Default country code
  const [phoneNumber, setPhoneNumber] = useState(
    ad?.phone.substring(ad?.phone.length - 9) ?? ""
  );

  const formatPhoneNumber = (input: any) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, "");

    // Apply formatting based on length
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

  const handleCountryCodeChange = (e: any) => {
    setCountryCode(e.target.value);
  };

  const handleInputChange = (e: any) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setPhoneNumber(formatted);
  };

  //const fullPhoneNumber = countryCode + removeLeadingZero(phoneNumber);

  function removeLeadingZero(numberString: string) {
    // Check if the first character is '0'
    if (numberString.charAt(0) === "0") {
      // If yes, return the string without the first character
      return numberString.substring(1);
    } else {
      // If no, return the original string
      return numberString;
    }
  }
  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }

  const [selectedfeaturesOptions, setSelectedfeaturesOptions] = useState<
    string[]
  >(ad?.vehiclekeyfeatures ?? []);

  const handleFeaturesToggle = (feature: string) => {
    if (selectedfeaturesOptions.includes(feature)) {
      const allfeatures = selectedfeaturesOptions.filter(
        (f: any) => f !== feature
      );
      form.setValue("vehiclekeyfeatures", allfeatures); // Reset constituency value
      setSelectedfeaturesOptions(allfeatures);
    } else {
      const allfeatures = [...selectedfeaturesOptions, feature];
      form.setValue("vehiclekeyfeatures", allfeatures); // Reset constituency value
      setSelectedfeaturesOptions(allfeatures);
    }
  };

  const [selectedamenitiesOptions, setSelectedamenitiesOptions] = useState<
    string[]
  >(ad?.amenities ?? []);

  const handleamenitiesToggle = (feature: string) => {
    if (selectedamenitiesOptions.includes(feature)) {
      const allfeatures = selectedamenitiesOptions.filter(
        (f: any) => f !== feature
      );
      form.setValue("amenities", allfeatures); // Reset constituency value
      setSelectedamenitiesOptions(allfeatures);
    } else {
      const allfeatures = [...selectedamenitiesOptions, feature];
      form.setValue("amenities", allfeatures); // Reset constituency value
      setSelectedamenitiesOptions(allfeatures);
    }
  };

  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);

    activePackage?.price.forEach((price: any, indexx: number) => {
      if (indexx === index) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  };
  const handleClick = (pack: Package) => {
    const currDate = new Date();
    // Add one month to the current date
    let expirationDate = new Date(currDate);
    expirationDate.setMonth(currDate.getMonth() + 1);
    if (pack.name === "Free") {
      setadstatus("Active");
    } else {
      setadstatus("Pending");
    }
    setActivePackage(pack);
    setplanId(pack._id);
    setpriority(pack.priority);
    setexpirationDate(expirationDate);
    pack.price.forEach((price: any, index: number) => {
      if (index === activeButton) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
        // alert(price.period);
      }
    });
    //}
  };
  const [showPop, setShowPop] = useState(false);

  const togglePopup = () => {
    setShowPop((prev) => !prev);
  };

  const [newModel, setNewModel] = useState("");
  const [newmake, setNewMake] = useState("");
  const handleAddModel = () => {
    if (newmake) {
      const formattedModel =
        newModel.charAt(0).toUpperCase() + newModel.slice(1).toLowerCase();

      addModelToMake(newmake, formattedModel);
      form.setValue("vehiclemodel", formattedModel);
    }
  };

  const formatToCurrency = (value: string | number) => {
    if (!value) return "0";
    const numberValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  // Handle changes and strip non-numeric characters

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-1 mr-0 ml-0 lg:mr-20 lg:ml-20"
        >
          <div className="lg:p-1 rounded-sm m-1 shadow-lg bg-white">
            <div className="flex flex-col">
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

              {loading ? (
                <div className="flex justify-center items-center h-[56px]">
                  <div className="flex gap-1 items-center">
                    <CircularProgress sx={{ color: "black" }} size={30} />
                    Loading categories...
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="w-full overflow-hidden rounded-full px-4 py-2">
                            <Autocomplete
                              id="categoryId"
                              options={categories.filter(
                                (category) => category.name === "Vehicle"
                              )}
                              getOptionLabel={(option) => option.name}
                              value={
                                categories.find(
                                  (category) => category._id === field.value
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                field.onChange(newValue ? newValue._id : null);
                                // Reset subcategory value
                                form.setValue("subcategory", "");
                                // Trigger re-render to update subcategory options
                                form.getValues();
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Category*"
                                />
                              )}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="w-full overflow-hidden rounded-full px-4 py-2">
                            <Autocomplete
                              id="subcategory"
                              options={
                                categories
                                  .find(
                                    (category) =>
                                      category._id ===
                                      form.getValues("categoryId")
                                  )
                                  ?.subcategory.map((sub: any) => sub.title) ||
                                []
                              }
                              value={field.value}
                              onChange={(event, newValue) => {
                                field.onChange(newValue);
                                SetselectedCategory(newValue);
                              }}
                              renderInput={(field) => (
                                <TextField
                                  {...field}
                                  label="Select Sub Category*"
                                />
                              )}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {SelectedCategory === "Cars, Vans & Pickups" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="make"
                                options={vehicleModels}
                                getOptionLabel={(option) => option.make}
                                value={
                                  vehicleModels.find(
                                    (vehicle) => vehicle.make === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.make : null
                                  );
                                  setNewMake(newValue ? newValue?.make : "");
                                  form.setValue("vehiclemodel", ""); // Reset constituency value
                                  form.getValues(); // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Make*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errormake}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehiclemodel"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="flex w-full overflow-hidden rounded-full items-center">
                              <div className="w-full overflow-hidden rounded-full p-4 py-2">
                                <Autocomplete
                                  id="vehiclemodel"
                                  options={
                                    vehicleModels.find(
                                      (vehicle) =>
                                        vehicle.make === form.getValues("make")
                                    )?.models || []
                                  }
                                  value={field.value}
                                  //freeSolo // This allows users to type a custom model
                                  onChange={(event, newValue) => {
                                    field.onChange(newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Model*" />
                                  )}
                                />

                                <div className="text-[#FF0000] text-sm">
                                  {errormodel}
                                </div>
                              </div>
                              {form.getValues("make") && (
                                <AlertDialog>
                                  <AlertDialogTrigger className="">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="bg-black rounded-sm flex w-[80px] text-xs p-2 text-white hover:bg-green-500 mr-4">
                                            Add New model?
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Add New model if missing!</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-white">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Add new {form.getValues("make")} model
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        <Input
                                          type="text"
                                          placeholder="Model name"
                                          className="input-field mt-3"
                                          onChange={(e) =>
                                            setNewModel(e.target.value)
                                          }
                                        />
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          startTransition(handleAddModel)
                                        }
                                      >
                                        Add
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleyear"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleyear"
                                options={years}
                                getOptionLabel={(option) => option}
                                value={
                                  years.find((yr) => yr === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Manufacture year*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleyear}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleBodyTypes"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleBodyTypes"
                                options={vehicleBodyTypes}
                                getOptionLabel={(option) => option.type}
                                value={
                                  vehicleBodyTypes.find(
                                    (vc) => vc.type === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.type : null
                                  );
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Body Type*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleBodyTypes}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleFuelTypes"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleFuelTypes"
                                options={vehicleFuelTypes}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleFuelTypes.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Fuel Type*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleFuelTypes}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecondition"
                                options={vehicleConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleConditions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Condition*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleregistered"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleregistered"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Registered*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleregistered}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleEngineSizesCC"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="Engine Size CC*"
                                className="w-full"
                              />

                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleEngineSizesCC}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclemileage"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <div className="flex gap-1 items-center justify-between">
                                <TextField
                                  {...field}
                                  label="Mileage (Optional)*"
                                  className="w-full"
                                />
                                kilometers (KM)
                              </div>
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclemileage}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehiclesecordCondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclesecordCondition"
                                options={vehicleSecondConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleSecondConditions.find(
                                    (ic) => ic === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Secord condition (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclesecordCondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleTransmissions"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleTransmissions"
                                options={vehicleTransmissions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleTransmissions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Transmissions (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleTransmissions}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehiclekeyfeatures"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden px-4 py-2">
                              {/* Trigger for Pop-up */}
                              <div className="cursor-pointer">
                                <TextField
                                  {...field}
                                  multiline
                                  label="Features (Optional)*"
                                  onClick={togglePopup}
                                  className="w-full"
                                />
                              </div>

                              {/* Custom Popup Content */}
                              {showPop && (
                                <div className="absolute z-10 w-[300px] shadow-lg bg-white rounded-md border p-1 mt-2">
                                  <div className="flex justify-end">
                                    <button
                                      onClick={togglePopup}
                                      className="text-gray-600 hover:text-gray-800 font-bold text-sm p-2"
                                    >
                                      X
                                    </button>
                                  </div>
                                  <ScrollArea className="h-[200px] w-full">
                                    {vehicleFeatures.map((option) => (
                                      <div
                                        key={option}
                                        className="flex w-full gap-2 p-2"
                                      >
                                        <input
                                          className="cursor-pointer"
                                          type="checkbox"
                                          value={option}
                                          checked={selectedfeaturesOptions.includes(
                                            option
                                          )}
                                          onChange={() =>
                                            handleFeaturesToggle(option)
                                          }
                                        />
                                        <div className="text-sm">{option}</div>
                                      </div>
                                    ))}
                                  </ScrollArea>
                                </div>
                              )}
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclekeyfeatures}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehiclechassis"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="VIN Chassis Number (Optional)*"
                                className="w-full"
                              />

                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclechassis}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehiclecolor"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecolor"
                                options={vehicleColors}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleColors.find(
                                    (color) => color === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Body color (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecolor}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleinteriorColor"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleinteriorColor"
                                options={interiorVehicleColors}
                                getOptionLabel={(option) => option}
                                value={
                                  interiorVehicleColors.find(
                                    (ic) => ic === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Interior color (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleinteriorColor}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleSeats"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleSeats"
                                options={vehicleSeats}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleSeats.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Seats (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleSeats}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleexchangeposible"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleexchangeposible"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Exchange possible (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleexchangeposible}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              {SelectedCategory === "Buses & Microbuses" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="make"
                                options={BusesMake}
                                getOptionLabel={(option) => option.make}
                                value={
                                  BusesMake.find(
                                    (vehicle) => vehicle.make === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.make : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Make*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleyear"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleyear"
                                options={years}
                                getOptionLabel={(option) => option}
                                value={
                                  years.find((yr) => yr === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Manufacture year*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleyear}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleFuelTypes"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleFuelTypes"
                                options={vehicleFuelTypes}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleFuelTypes.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Fuel Type*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleFuelTypes}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecondition"
                                options={vehicleConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleConditions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Condition*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleregistered"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleregistered"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Registered*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleregistered}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclesecordCondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclesecordCondition"
                                options={vehicleSecondConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleSecondConditions.find(
                                    (ic) => ic === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Secord condition (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclesecordCondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleTransmissions"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleTransmissions"
                                options={vehicleTransmissions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleTransmissions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Transmissions (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleTransmissions}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecolor"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecolor"
                                options={vehicleColors}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleColors.find(
                                    (color) => color === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Body color (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecolor}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleexchangeposible"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleexchangeposible"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Exchange possible (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleexchangeposible}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {SelectedCategory === "Heavy Equipment" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="Types"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="Types"
                                options={equipmentTypes}
                                getOptionLabel={(option) => option.type}
                                value={
                                  equipmentTypes.find(
                                    (vehicle) => vehicle.type === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.type : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Type*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorTypes}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="make"
                                options={equipmentMakes}
                                getOptionLabel={(option) => option.make}
                                value={
                                  equipmentMakes.find(
                                    (vehicle) => vehicle.make === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.make : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Make*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleyear"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleyear"
                                options={years}
                                getOptionLabel={(option) => option}
                                value={
                                  years.find((yr) => yr === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Manufacture year*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleyear}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecondition"
                                options={vehicleConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleConditions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Condition*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleexchangeposible"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleexchangeposible"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Exchange possible (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleexchangeposible}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              {SelectedCategory === "Motorbikes,Tuktuks & Scooters" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="make"
                                options={motorcycleMakes}
                                getOptionLabel={(option) => option.make}
                                value={
                                  motorcycleMakes.find(
                                    (vehicle) => vehicle.make === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.make : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Make*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleyear"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleyear"
                                options={years}
                                getOptionLabel={(option) => option}
                                value={
                                  years.find((yr) => yr === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Manufacture year*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleyear}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehiclecondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecondition"
                                options={vehicleConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleConditions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Condition*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleEngineSizesCC"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="Engine Size CC (Optional)*"
                                className="w-full"
                              />

                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleEngineSizesCC}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleexchangeposible"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleexchangeposible"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Exchange possible (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleexchangeposible}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecolor"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecolor"
                                options={vehicleColors}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleColors.find(
                                    (color) => color === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Body color (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecolor}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              {SelectedCategory === "Trucks & Trailers" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="Types"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="Types"
                                options={truckTypes}
                                getOptionLabel={(option) => option.type}
                                value={
                                  truckTypes.find(
                                    (vehicle) => vehicle.type === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.type : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Type*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="make"
                                options={truckMakes}
                                getOptionLabel={(option) => option}
                                value={
                                  truckMakes.find(
                                    (vehicle) => vehicle === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Make*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleyear"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleyear"
                                options={years}
                                getOptionLabel={(option) => option}
                                value={
                                  years.find((yr) => yr === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Manufacture year*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleyear}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecondition"
                                options={vehicleConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleConditions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Condition*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleTransmissions"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleTransmissions"
                                options={vehicleTransmissions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleTransmissions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Transmissions (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleTransmissions}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleexchangeposible"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleexchangeposible"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Exchange possible (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleexchangeposible}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              {SelectedCategory === "Vehicle Parts & Accessories" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="Types"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="Types"
                                options={automotivePartsCategories}
                                getOptionLabel={(option) => option.name}
                                value={
                                  automotivePartsCategories.find(
                                    (vehicle) => vehicle.name === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.name : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Type*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="make"
                                options={automotivePartsMakes}
                                getOptionLabel={(option) => option.make}
                                value={
                                  automotivePartsMakes.find(
                                    (vehicle) => vehicle.make === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.make : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Make*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecondition"
                                options={vehicleConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleConditions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Condition*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              {SelectedCategory === "Watercraft & Boats" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="Types"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="Types"
                                options={boatTypes}
                                getOptionLabel={(option) => option.type}
                                value={
                                  boatTypes.find(
                                    (vehicle) => vehicle.type === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.type : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Type*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclecondition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehiclecondition"
                                options={vehicleConditions}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleConditions.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Condition*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="vehicleyear"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleyear"
                                options={years}
                                getOptionLabel={(option) => option}
                                value={
                                  years.find((yr) => yr === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Manufacture year*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleyear}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleexchangeposible"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="vehicleexchangeposible"
                                options={vehicleRegistered}
                                getOptionLabel={(option) => option}
                                value={
                                  vehicleRegistered.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Exchange possible (Optional)*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehicleexchangeposible}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {SelectedCategory === "New builds" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="estatename"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="Estate Name*"
                                className="w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Types"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="Types"
                                options={propertyType}
                                getOptionLabel={(option) => option.type}
                                value={
                                  propertyType.find(
                                    (vehicle) => vehicle.type === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.type : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Type*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="status"
                                options={constructionStatus}
                                getOptionLabel={(option) => option}
                                value={
                                  constructionStatus.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Construction Status*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="Property size(sqm)*"
                                className="w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="floors"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="floors"
                                options={floors}
                                getOptionLabel={(option) => option}
                                value={
                                  floors.find((vc) => vc === field.value) ||
                                  null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Number of Floors*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="houseclass"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="houseclass"
                                options={businessType}
                                getOptionLabel={(option) => option}
                                value={
                                  businessType.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="housing Class*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="bedrooms"
                                options={bedrooms}
                                getOptionLabel={(option) => option}
                                value={
                                  bedrooms.find((vc) => vc === field.value) ||
                                  null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Number of bedrooms*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="bathrooms"
                                options={bathrooms}
                                getOptionLabel={(option) => option}
                                value={
                                  bathrooms.find((vc) => vc === field.value) ||
                                  null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Number of bathrooms*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="parking"
                                options={yesno}
                                getOptionLabel={(option) => option}
                                value={
                                  yesno.find((vc) => vc === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Parking*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="propertysecurity"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="propertysecurity"
                                options={yesno}
                                getOptionLabel={(option) => option}
                                value={
                                  yesno.find((vc) => vc === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Security*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="fee"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="Agency Fee*"
                                className="w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden px-4 py-2">
                              <HoverCard>
                                <HoverCardTrigger>
                                  <TextField
                                    {...field}
                                    label="Amenities*"
                                    disabled
                                    className="w-full"
                                  />
                                </HoverCardTrigger>
                                <HoverCardContent className="">
                                  <ScrollArea className="h-[200px] w-full  bg-white rounded-md border p-1">
                                    {amenities.map((option) => (
                                      <>
                                        <div
                                          key={option}
                                          className="flex w-full gap-2"
                                        >
                                          <input
                                            className="cursor-pointer"
                                            type="checkbox"
                                            value={option}
                                            checked={selectedamenitiesOptions.includes(
                                              option
                                            )}
                                            onChange={() =>
                                              handleamenitiesToggle(option)
                                            }
                                          />
                                          <div className="text-sm">
                                            {" "}
                                            {option}
                                          </div>
                                        </div>
                                      </>
                                    ))}
                                  </ScrollArea>
                                </HoverCardContent>
                              </HoverCard>
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclekeyfeatures}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              {SelectedCategory === "Houses & Apartments for Sale" && (
                <>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="estatename"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="Estate Name*"
                                className="w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Types"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="Types"
                                options={propertyType}
                                getOptionLabel={(option) => option.type}
                                value={
                                  propertyType.find(
                                    (vehicle) => vehicle.type === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.type : null
                                  );
                                  // Trigger re-render to update constituency options
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Select Type*" />
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="status"
                                options={propertyCondition}
                                getOptionLabel={(option) => option}
                                value={
                                  propertyCondition.find(
                                    (vc) => vc === field.value
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Conditions*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <TextField
                                {...field}
                                label="Property size(sqm)*"
                                className="w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="floors"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="floors"
                                options={floors}
                                getOptionLabel={(option) => option}
                                value={
                                  floors.find((vc) => vc === field.value) ||
                                  null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Number of Floors*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="bedrooms"
                                options={bedrooms}
                                getOptionLabel={(option) => option}
                                value={
                                  bedrooms.find((vc) => vc === field.value) ||
                                  null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Number of bedrooms*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="bathrooms"
                                options={bathrooms}
                                getOptionLabel={(option) => option}
                                value={
                                  bathrooms.find((vc) => vc === field.value) ||
                                  null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField
                                    {...field}
                                    label="Number of bathrooms*"
                                  />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="parking"
                                options={yesno}
                                getOptionLabel={(option) => option}
                                value={
                                  yesno.find((vc) => vc === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Parking*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="furnishing"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden rounded-full px-4 py-2">
                              <Autocomplete
                                id="furnishing"
                                options={furnishing}
                                getOptionLabel={(option) => option}
                                value={
                                  furnishing.find((vc) => vc === field.value) ||
                                  null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue ? newValue : null);
                                }}
                                renderInput={(field) => (
                                  <TextField {...field} label="Furnishing*" />
                                )}
                              />
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclecondition}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full overflow-hidden px-4 py-2">
                              <HoverCard>
                                <HoverCardTrigger>
                                  <TextField
                                    {...field}
                                    label="Property Feature*"
                                    className="w-full"
                                  />
                                </HoverCardTrigger>
                                <HoverCardContent className="">
                                  <div className="text-sm">OPTIONS</div>
                                  <ScrollArea className="h-[200px] w-full  bg-white rounded-md border p-1">
                                    {propertyFeature.map((option) => (
                                      <>
                                        <div
                                          key={option}
                                          className="flex w-full gap-2"
                                        >
                                          <input
                                            className="cursor-pointer"
                                            type="checkbox"
                                            value={option}
                                            checked={selectedamenitiesOptions.includes(
                                              option
                                            )}
                                            onChange={() =>
                                              handleamenitiesToggle(option)
                                            }
                                          />
                                          <div className="text-sm">
                                            {" "}
                                            {option}
                                          </div>
                                        </div>
                                      </>
                                    ))}
                                  </ScrollArea>
                                </HoverCardContent>
                              </HoverCard>
                              <div className="text-[#FF0000] text-sm">
                                {errorvehiclekeyfeatures}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="w-full overflow-hidden rounded-full px-4 py-2">
                          <TextField
                            {...field}
                            label="Ad Title*"
                            className="w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="w-full overflow-hidden px-4 py-2">
                          <div className="grid w-full gap-1.5">
                            <TextField
                              {...field}
                              multiline
                              rows={5} // You can adjust this number based on your preference
                              label="Description*"
                              className="w-full"
                            />
                          </div>
                        </div>
                        {/*  <div className="w-full">
                          <div className="grid w-full px-3">
                            <ReactQuill
                              {...field}
                              placeholder="Description..."
                              className="bg-white h-[250px]text-base rounded-sm p-1 w-full h-full text-black"
                              modules={modules} // Pass the custom toolbar modules
                            />
                          </div>
                        </div>*/}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-5 mt-2 mr-2 ml-2 md:flex-row">
                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="min-h-[300px]">
                        {/*     <div className="hidden lg:inline relative w-full">
                          <FileUploader
                            onFieldChange={field.onChange}
                            imageUrls={field.value}
                            setFiles={setFiles}
                            userName={userName}
                          />
                          <div className="absolute ml-2 top-1 left-0 text-[#FF0000] text-sm">
                            {showmessage}
                          </div>
                        </div>
*/}
                        <div className="relative p-2 w-full">
                          <FileUploader
                            onFieldChange={field.onChange}
                            imageUrls={field.value}
                            setFiles={setFiles}
                            userName={userName}
                          />
                          <div className="absolute ml-2 top-1 left-0 text-[#FF0000] text-sm">
                            {showmessage}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex item-center w-full gap-1 overflow-hidden rounded-full px-4 py-2">
                          <TextField
                            {...field}
                            label="Price"
                            className="w-full"
                            value={formatToCurrency(field.value ?? 0)} // Format value as money
                            // inputProps={{
                            //  inputMode: "numeric",
                            //  pattern: "[0-9]*",
                            // }} // Ensures numeric input
                          />
                          <FormField
                            control={form.control}
                            name="negotiable"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center">
                                    <label
                                      htmlFor="negotiable"
                                      className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Negotiable
                                    </label>
                                    <Checkbox
                                      onCheckedChange={field.onChange}
                                      checked={field.value}
                                      id="negotiable"
                                      className="mr-2 h-5 w-5 border-2 border-primary-500"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex-center w-full gap-1 overflow-hidden rounded-full px-4 py-2">
                          <TextField
                            {...field}
                            label="Add Youtube link"
                            className="w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-5 px-4 mt-2 md:flex-row">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex w-full gap-1">
                          <select
                            className="bg-gray-100 text-sm lg:text-base p-1 border rounded-sm w-[120px] lg:w-[200px]"
                            value={countryCode}
                            onChange={handleCountryCodeChange}
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
                            <option value="+236">
                              Central African Republic (+236)
                            </option>
                            <option value="+235">Chad (+235)</option>
                            <option value="+269">Comoros (+269)</option>
                            <option value="+243">
                              Democratic Republic of the Congo (+243)
                            </option>
                            <option value="+253">Djibouti (+253)</option>
                            <option value="+20">Egypt (+20)</option>
                            <option value="+240">
                              Equatorial Guinea (+240)
                            </option>
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
                            <option value="+242">
                              Republic of the Congo (+242)
                            </option>
                            <option value="+250">Rwanda (+250)</option>
                            <option value="+239">
                              Sao Tome and Principe (+239)
                            </option>
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
                            label="Contact phone number"
                            type="tel"
                            value={phoneNumber}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-10 mt-2">
                <div className="w-full overflow-bg-white px-4 py-0">
                  <div className="grid w-full gap-1.5">
                    <h2 className="font-bold">Location: {myaddress}</h2>
                    {/* Radio buttons for options */}
                    <div className="flex flex-col gap-5 md:flex-row">
                      <div className="flex w-full gap-1 p-1">
                        <input
                          type="radio"
                          id="search"
                          name="locationOption"
                          value="search"
                          checked={selectedOption === "search"}
                          onChange={handleOptionChange}
                        />
                        <label htmlFor="search">Approximate Location</label>
                      </div>
                      <div className=" flex w-full gap-1 p-1">
                        <input
                          type="radio"
                          id="enter"
                          name="locationOption"
                          value="enter"
                          checked={selectedOption === "enter"}
                          onChange={handleOptionChange}
                        />
                        <label htmlFor="enter">Precise Location</label>
                      </div>
                    </div>
                    {/* Conditionally render based on selected option */}
                    {selectedOption === "search" ? (
                      <GooglePlacesAutocomplete
                        apiKey="AIzaSyBti8wo3gFt3cUXfe2peKbbJgzkSPnZtRk"
                        selectProps={{
                          placeholder: "Search your location",
                          className: "p-1", // Add your custom class here
                          onChange: handleSelect,
                        }}
                        autocompletionRequest={{
                          componentRestrictions: {
                            country: ["KE"], // Limits results to Kenya
                          },
                        }}
                      />
                    ) : (
                      <div className="flex flex-col gap-5 md:flex-row">
                        <TextField
                          type="text"
                          label="Latitude"
                          className="w-full"
                          onChange={handleLatitudeChange}
                        />
                        <TextField
                          type="text"
                          label="Longitude"
                          className="w-full"
                          onChange={handleLongitudeChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {type === "Create" && (
            <>
              <div className="p-1 rounded-sm m-1 shadow-lg bg-white">
                <div className="m-3">
                  <div className="items-center flex">
                    <h2 className="font-bold text-[25px] p-5">
                      Promote your ad
                    </h2>
                  </div>

                  {daysRemaining > 0 && listed > 0 ? (
                    <>
                      <div className="text-center sm:text-left rounded-lg bg-white p-3 relative">
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <div className="font-bold text-lg mt-3">
                              Plan: {packname}
                            </div>
                            <div className="text-xs flex gap-5">
                              <div className="flex gap-1">
                                Days remaining:
                                <div className="font-bold">{daysRemaining}</div>
                              </div>
                              <div className="flex gap-1">
                                Ads Remaining:
                                <div className="font-bold">{listed}</div>
                              </div>
                            </div>
                          </div>
                          <Link href="/plan">
                            <p className="p-2 underline bg-grey-50 text-xs cursor-pointer border-2 border-transparent rounded-sm hover:bg-[#000000]  hover:text-white">
                              Upgrade Plan
                            </p>
                          </Link>
                        </div>

                        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                          Active
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-grey p-1">
                        Choose the plan that will work for you
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 m-1 gap-1">
                        {packagesList.length > 0 &&
                          packagesList.map((pack: any, index: any) => {
                            // const check = packname == pack.name != "Free";
                            const issamepackage = packname === pack.name;
                            return (
                              <div
                                key={index}
                                className={`shadow-md rounded-md p-0 cursor-pointer ${
                                  activePackage === pack
                                    ? "bg-[#F2FFF2] border-[#4DCE7A] border-2"
                                    : ""
                                }`}
                                onClick={() =>
                                  (!issamepackage && pack.name === "Free") ||
                                  (issamepackage &&
                                    pack.name === "Free" &&
                                    listed === 0)
                                    ? {}
                                    : handleClick(pack)
                                }
                              >
                                <div
                                  className={`text-lg font-bold rounded-t-md text-white py-2 px-4 mb-4 flex flex-col items-center justify-center`}
                                  style={{
                                    backgroundColor:
                                      activePackage === pack
                                        ? "#4DCE7A"
                                        : pack.color,
                                  }}
                                >
                                  {pack.name}
                                </div>
                                <div className="p-3">
                                  <ul className="flex flex-col gap-1 p-1">
                                    {pack.features
                                      .slice(0, 2)
                                      .map((feature: any, index: number) => (
                                        <li
                                          key={index}
                                          className="flex items-center gap-1"
                                        >
                                          <Image
                                            src={`/assets/icons/${
                                              feature.checked
                                                ? "check"
                                                : "cross"
                                            }.svg`}
                                            alt={
                                              feature.checked
                                                ? "check"
                                                : "cross"
                                            }
                                            width={24}
                                            height={24}
                                          />
                                          <p className="text-sm">
                                            {feature.title}
                                          </p>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                                <div className="p-3">
                                  <div className="text-gray-600 mb-1">
                                    <div className="flex gap-2 text-sm">
                                      {daysRemaining > 0 &&
                                      pack.name === packname ? (
                                        <>
                                          <div className="p-1 flex-block rounded-full bg-emerald-500">
                                            <p className="text-white text-xs">
                                              Active
                                            </p>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {(!issamepackage &&
                                            pack.name === "Free") ||
                                          (issamepackage &&
                                            pack.name === "Free" &&
                                            listed === 0) ? (
                                            <div>
                                              <div className="p-1 items-center justify-center flex rounded-full bg-grey-50">
                                                <p className="text-black font-bold text-xs">
                                                  Disabled
                                                </p>
                                              </div>
                                              <div className="text-xs text-grey-200 p-1">
                                                You can&apos;t subscribe to Free
                                                Package
                                              </div>
                                            </div>
                                          ) : (
                                            issamepackage &&
                                            pack.name === "Free" &&
                                            listed > 0 && (
                                              <div className="p-1 w-full items-center justify-center flex rounded-full bg-emerald-500">
                                                <p className="text-white text-xs">
                                                  Active
                                                </p>
                                              </div>
                                            )
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    {pack.name === "Free" ? (
                                      <></>
                                    ) : (
                                      <>
                                        <div className="text-gray-800 font-bold mb-0">
                                          <ul className="flex flex-col gap-0 py-0">
                                            {pack.price.map(
                                              (price: any, index: number) => (
                                                <li
                                                  key={index}
                                                  className={`flex items-center gap-0 ${
                                                    index !== activeButton
                                                      ? "hidden"
                                                      : ""
                                                  }`}
                                                >
                                                  <p className="text-xs font-bold lg:p-16-regular">
                                                    Ksh {price.amount}/{" "}
                                                    {activeButtonTitle}
                                                  </p>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      <div className="h-auto md:h-24 p-3 flex flex-col md:flex-row justify-between items-center">
                        {/* Left-aligned buttons */}
                        <div className="flex flex-wrap justify-center md:justify-start items-center mb-4 md:mb-0">
                          <button
                            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
                              activeButton === 0
                                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                            }`}
                            onClick={() => handleButtonClick(0, "1 week")}
                          >
                            1 week
                          </button>
                          <button
                            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
                              activeButton === 1
                                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                            }`}
                            onClick={() => handleButtonClick(1, "1 month")}
                          >
                            1 month
                          </button>
                          <button
                            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
                              activeButton === 2
                                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                            }`}
                            onClick={() => handleButtonClick(2, "3 months")}
                          >
                            3 months
                          </button>
                          <button
                            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
                              activeButton === 3
                                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                            }`}
                            onClick={() => handleButtonClick(3, " 6 months")}
                          >
                            6 months
                          </button>
                          <button
                            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
                              activeButton === 4
                                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                            }`}
                            onClick={() => handleButtonClick(4, " 1 year")}
                          >
                            1 year
                          </button>
                        </div>

                        {/*<div className="flex gap-1 justify-center items-center">
                          <label
                            htmlFor="color"
                            className="whitespace-nowrap p-3 font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Charge Ksh
                          </label>
                          <input
                            type="text"
                            disabled
                            value={priceInput}
                            className="px-4 py-2 w-[200px] border border-gray-300 font-bold rounded-md mr-4"
                          />
                        </div>
                        */}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            <div className="flex gap-1 items-center">
              {form.formState.isSubmitting && (
                <CircularProgressWithLabel value={uploadProgress} />
              )}

              {form.formState.isSubmitting ? "Submitting..." : `${type} Ad `}
            </div>
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AdForm;
