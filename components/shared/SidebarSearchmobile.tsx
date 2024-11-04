import { ICategory } from "@/lib/database/models/category.model";
import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  formUrlQuerymultiple,
  formUrlQuery,
  removeKeysFromQuery,
} from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SignalWifiStatusbarNullOutlinedIcon from "@mui/icons-material/SignalWifiStatusbarNullOutlined";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import CategoryFilterSearch from "./CategoryFilterSearch";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import InvertColorsOutlinedIcon from "@mui/icons-material/InvertColorsOutlined";
import FormatPaintOutlinedIcon from "@mui/icons-material/FormatPaintOutlined";
import FormatStrikethroughOutlinedIcon from "@mui/icons-material/FormatStrikethroughOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import AirlineSeatReclineExtraOutlinedIcon from "@mui/icons-material/AirlineSeatReclineExtraOutlined";
import SignalWifiStatusbarConnectedNoInternet4OutlinedIcon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4Outlined";
import { Input } from "../ui/input";
import {
  BusesMake,
  automotivePartsCategories,
  automotivePartsMakes,
  boatTypes,
  equipmentMakes,
  equipmentTypes,
  interiorVehicleColors,
  motorcycleMakes,
  truckMakes,
  truckTypes,
  vehicleBodyTypes,
  vehicleColors,
  vehicleConditions,
  vehicleFuelTypes,
  vehicleModels,
  vehicleRegistered,
  vehicleSeats,
  vehicleSecondConditions,
  vehicleTransmissions,
} from "@/constants";
type sidebarProps = {
  category: string;
  categoryList?: any;
  AdsCountPerSubcategory?: any;
  AdsCountPerRegion?: any;
  subcategory?: string;
  AdsCountPerVerifiedTrue: any;
  AdsCountPerVerifiedFalse: any;
  make: any;
  AdsCountPerColor: any;
  AdsCountPerTransmission: any;
  AdsCountPerFuel: any;
  AdsCountPerCondition: any;
  AdsCountPerCC: any;
  AdsCountPerExchange: any;
  AdsCountPerBodyType: any;
  AdsCountPerRegistered: any;
  AdsCountPerSeats: any;
  AdsCountPersecondCondition: any;
  AdsCountPerYear: any;
  Types: any;
  AdsCountPerlanduse: any;
  AdsCountPerfloors: any;
  AdsCountPerhouseclass: any;
  AdsCountPerbedrooms: any;
  AdsCountPerbathrooms: any;
  AdsCountPerfurnishing: any;
  AdsCountPeramenities: any;
  AdsCountPertoilets: any;
  AdsCountPerparking: any;
  AdsCountPerstatus: any;
  AdsCountPerarea: any;
  AdsCountPerpropertysecurity: any;
};

const SidebarSearchmobile = ({
  category,
  categoryList,
  AdsCountPerSubcategory,
  AdsCountPerRegion,
  subcategory,
  AdsCountPerVerifiedTrue,
  AdsCountPerVerifiedFalse,
  make,
  AdsCountPerColor,
  AdsCountPerTransmission,
  AdsCountPerFuel,
  AdsCountPerCondition,
  AdsCountPerCC,
  AdsCountPerExchange,
  AdsCountPerBodyType,
  AdsCountPerRegistered,
  AdsCountPerSeats,
  AdsCountPersecondCondition,
  AdsCountPerYear,
  Types,
  AdsCountPerlanduse,
  AdsCountPerfloors,
  AdsCountPerhouseclass,
  AdsCountPerbedrooms,
  AdsCountPerbathrooms,
  AdsCountPerfurnishing,
  AdsCountPeramenities,
  AdsCountPertoilets,
  AdsCountPerparking,
  AdsCountPerstatus,
  AdsCountPerarea,
  AdsCountPerpropertysecurity,
}: sidebarProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  //const [Region, setRegion] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(4);
  //console.log(AdsCountPerCondition);

  const [selectedRegion, setSelectedRegion] = useState("All Kenya");

  const handleYearChange = (yearfrom: string, yearto: string) => {
    let newUrl = "";
    setyearfrom(yearfrom);
    setyearto(yearto);
    if (yearfrom && yearto) {
      newUrl = formUrlQuerymultiple({
        params: searchParams.toString(),
        updates: {
          yearfrom: yearfrom,
          yearto: yearto,
        },
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["yearfrom", "yearto"],
      });
    }
    router.push(newUrl, { scroll: false });
  };

  const handlePriceChange = (minPrice: string, maxPrice: string) => {
    let newUrl = "";
    setminPrice(minPrice);
    setmaxPrice(maxPrice);
    if (minPrice && maxPrice) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "Price",
        value: minPrice + "-" + maxPrice,
      });
      router.push(newUrl, { scroll: false });
    } //else {
    //setminPrice("");
    //setmaxPrice("");
    // newUrl = removeKeysFromQuery({
    //  params: searchParams.toString(),
    //  keysToRemove: ["Price"],
    //   });
    // }
  };

  const handleRegionClick = (regionId: any) => {
    // Update the selected region state

    let newUrl = "";
    if (regionId) {
      newUrl = formUrlQuerymultiple({
        params: searchParams.toString(),
        updates: {
          category: category.toString(),
          region: regionId.toString(),
        },
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["region"],
      });
    }
    setSelectedRegion(regionId);
    closeDialog();
    router.push(newUrl, { scroll: false });
    // Perform any other actions you need
  };
  const handleChange = (value: string) => {
    let newUrl = "";

    if (value) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "membership",
        value: value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["membership"],
      });
    }
    setSelectedOption(value);
    router.push(newUrl, { scroll: false });
    //alert(value);
  };

  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [selectedConditionOption, setselectedConditionOption] = useState("all");
  const [selectedColorOption, setselectedColorOption] = useState("all");
  const [selectedTransmissionOption, setselectedTransmissionOption] =
    useState("all");
  const [selectedFuelOption, setselectedFuelOption] = useState("all");
  const [selectedBodyOption, setselectedBodyOption] = useState("all");
  const [selectedCCOption, setselectedCCOption] = useState("all");
  const [selectedRegisteredOption, setselectedRegisteredOption] =
    useState("all");

  const [selectedExchangeOption, setselectedExchangeOption] = useState("all");

  const [selectedSeatsOption, setselectedSeatsOption] = useState("all");

  const [selectedSecondOption, setselectedSecondOption] = useState("all");

  const [selectedMakeOption, setselectedMakeOption] = useState("all");

  const [yearfrom, setyearfrom] = useState("");
  const [yearto, setyearto] = useState("");

  const [selectedTypesOption, setselectedTypesOption] = useState("all");

  const handleExchangeChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedExchangeOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleexchangeposible",
        value: value,
      });
    } else {
      setselectedExchangeOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleexchangeposible"],
      });
    }
    router.push(newUrl, { scroll: false });
    //alert(value);
  };

  const handleRegisteredChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedRegisteredOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleregistered",
        value: value,
      });
    } else {
      setselectedRegisteredOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleregistered"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };
  const handleCCChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedCCOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleEngineSizesCC",
        value: value,
      });
    } else {
      setselectedCCOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleEngineSizesCC"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };
  const handleBodyChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedBodyOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleBodyTypes",
        value: value,
      });
    } else {
      setselectedBodyOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleBodyTypes"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };
  const handleFuelChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedFuelOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleFuelTypes",
        value: value,
      });
    } else {
      setselectedFuelOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleFuelTypes"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };

  const handleTransmissionChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedTransmissionOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleTransmissions",
        value: value,
      });
    } else {
      setselectedTransmissionOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleTransmissions"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };

  const handleConditionChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedConditionOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclecondition",
        value: value,
      });
    } else {
      setselectedConditionOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclecondition"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };

  const [selectedfloorsOption, setselectedfloorsOption] = useState("all");

  const handlefloorsChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedfloorsOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "floors",
        value: value,
      });
    } else {
      setselectedfloorsOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["floors"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedpropertysecurityOption, setselectedpropertysecurityOption] =
    useState("all");

  const handlepropertysecurityChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedpropertysecurityOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "propertysecurity",
        value: value,
      });
    } else {
      setselectedpropertysecurityOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["propertysecurity"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedlanduseOption, setselectedlanduseOption] = useState("all");

  const handlelanduseChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedlanduseOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "landuse",
        value: value,
      });
    } else {
      setselectedlanduseOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["landuse"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const [selectedareaOption, setselectedareaOption] = useState("all");

  const handleareaChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedareaOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "area",
        value: value,
      });
    } else {
      setselectedareaOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["area"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedstatusOption, setselectedstatusOption] = useState("all");

  const handlestatusChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedstatusOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "status",
        value: value,
      });
    } else {
      setselectedstatusOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["status"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedparkingOption, setselectedparkingOption] = useState("all");

  const handleparkingChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedparkingOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "parking",
        value: value,
      });
    } else {
      setselectedparkingOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["parking"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const [selectedtoiletsOption, setselectedtoiletsOption] = useState("all");

  const handletoiletsChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedtoiletsOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "toilets",
        value: value,
      });
    } else {
      setselectedtoiletsOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["toilets"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const [selectedamenitiesOption, setselectedamenitiesOption] = useState("all");

  const handleamenitiesChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedamenitiesOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "amenities",
        value: value,
      });
    } else {
      setselectedamenitiesOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["amenities"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedfurnishingOption, setselectedfurnishingOption] =
    useState("all");

  const handlefurnishingChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedfurnishingOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "furnishing",
        value: value,
      });
    } else {
      setselectedfurnishingOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["furnishing"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedbathroomsOption, setselectedbathroomsOption] = useState("all");

  const handlebathroomsChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedbathroomsOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "bathrooms",
        value: value,
      });
    } else {
      setselectedbathroomsOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["bathrooms"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedbedroomsOption, setselectedbedroomsOption] = useState("all");

  const handlebedroomsChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedbedroomsOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "bedrooms",
        value: value,
      });
    } else {
      setselectedbedroomsOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["bedrooms"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const handleTypesChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedTypesOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "Types",
        value: value,
      });
    } else {
      setselectedTypesOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["Types"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const handleMakeChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedMakeOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "make",
        value: value,
      });
    } else {
      setselectedMakeOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["make"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const handleSecondChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedSecondOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclesecordCondition",
        value: value,
      });
    } else {
      setselectedSecondOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclesecordCondition"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };

  const handleSeatsChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedSeatsOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleSeats",
        value: value,
      });
    } else {
      setselectedSeatsOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleSeats"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };
  const handleColorChange = (value: string) => {
    let newUrl = "";

    if (value) {
      setselectedColorOption(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclecolor",
        value: value,
      });
    } else {
      setselectedColorOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclecolor"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(value);
  };
  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }

  const [totalMake, settotalMake] = useState(0);
  const [totalColor, settotalColor] = useState(0);
  const [totalTransmission, settotalTransmission] = useState(0);
  const [totalFuel, settotalFuel] = useState(0);
  const [totalCondition, settotalCondition] = useState(0);
  const [totalCC, settotalCC] = useState(0);
  const [totalExchange, settotalExchange] = useState(0);
  const [totalBody, settotalBody] = useState(0);
  const [totalRegistered, settotalRegistered] = useState(0);
  const [totalSeats, settotalSeats] = useState(0);
  const [totalSecond, settotalSecond] = useState(0);
  const [totalRegion, settotalRegion] = useState(0);
  const [totalVerifiedAll, settotalVerifiedAll] = useState(0);

  const [totalYear, settotalYear] = useState(0);
  const [totalTypes, settotalTypes] = useState(0);
  const [totallanduse, settotallanduse] = useState(0);
  const [totalfloors, settotalfloors] = useState(0);
  const [totalhouseclass, settotalhouseclass] = useState(0);
  const [totalbedrooms, settotalbedrooms] = useState(0);
  const [totalbathrooms, settotalbathrooms] = useState(0);
  const [totalfurnishing, settotalfurnishing] = useState(0);
  const [totalamenities, settotalamenities] = useState(0);
  const [totaltoilets, settotaltoilets] = useState(0);
  const [totalparking, settotalparking] = useState(0);
  const [totalstatus, settotalstatus] = useState(0);
  const [totalarea, settotalarea] = useState(0);
  const [totalpropertysecurity, settotalpropertysecurity] = useState(0);
  useEffect(() => {
    try {
      const totalpropertysecurity = AdsCountPerpropertysecurity.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotalpropertysecurity(totalpropertysecurity); // Output: 4

      const totalarea = AdsCountPerarea.reduce((total: any, current: any) => {
        // Parse the adCount value to a number, ignore if it's not a valid number
        const adCount = parseInt(current.adCount);
        return !isNaN(adCount) ? total + adCount : total;
      }, 0);
      settotalarea(totalarea); // Output: 4

      const totalstatus = AdsCountPerstatus.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotalstatus(totalstatus); // Output: 4

      const totalparking = AdsCountPerparking.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotalparking(totalparking); // Output: 4

      const totaltoilets = AdsCountPertoilets.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotaltoilets(totaltoilets); // Output: 4

      const totaladbathrooms = AdsCountPerbathrooms.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotalbathrooms(totaladbathrooms); // Output: 4

      const totalbedrooms = AdsCountPerbedrooms.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotalbedrooms(totalbedrooms); // Output: 4

      const totalhouseclass = AdsCountPerhouseclass.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotalhouseclass(totalhouseclass); // Output: 4

      const totalfloors = AdsCountPerfloors.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotalfloors(totalfloors); // Output: 4

      const totallanduse = AdsCountPerlanduse.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );
      settotallanduse(totallanduse); // Output: 4

      const totalAdCountType = Types.reduce((total: any, current: any) => {
        // Parse the adCount value to a number, ignore if it's not a valid number
        const adCount = parseInt(current.adCount);
        return !isNaN(adCount) ? total + adCount : total;
      }, 0);
      settotalTypes(totalAdCountType); // Output: 4

      const totalAdCountYear = AdsCountPerYear.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalYear(totalAdCountYear); // Output: 4

      const totalAdCount = make.reduce((total: any, current: any) => {
        // Parse the adCount value to a number, ignore if it's not a valid number
        const adCount = parseInt(current.adCount);
        return !isNaN(adCount) ? total + adCount : total;
      }, 0);

      settotalMake(totalAdCount); // Output: 4

      const totalAdCountColor = AdsCountPerColor.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalColor(totalAdCountColor); // Output: 4

      const totalAdCountTransmission = AdsCountPerTransmission.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalTransmission(totalAdCountTransmission); // Output: 4

      const totalAdCountFuel = AdsCountPerFuel.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalFuel(totalAdCountFuel); // Output: 4

      const totalAdCountCondition = AdsCountPerCondition.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalCondition(totalAdCountCondition); // Output: 4

      const totalAdCountCC = AdsCountPerCC.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalCC(totalAdCountCC); // Output: 4

      const totalAdCountExchange = AdsCountPerExchange.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalExchange(totalAdCountExchange); // Output: 0

      const totalAdCountBody = AdsCountPerBodyType.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalBody(totalAdCountBody); // Output: 0

      const totalAdCountRegistered = AdsCountPerRegistered.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalRegistered(totalAdCountRegistered); // Output: 0

      const totalAdCountSeats = AdsCountPerSeats.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalSeats(totalAdCountSeats); // Output: 0

      const totalAdCountSecond = AdsCountPersecondCondition.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalSecond(totalAdCountSecond); // Output: 0

      const totalAdCountRegion = AdsCountPerRegion.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalRegion(totalAdCountRegion); // Output: 0

      const totalAdCountVerified = AdsCountPerVerifiedTrue.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const totalAds = parseInt(current.totalAds);
          return !isNaN(totalAds) ? total + totalAds : total;
        },
        0
      );

      const totalAdCountVerifiedFalse = AdsCountPerVerifiedFalse.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const totalAds = parseInt(current.totalAds);
          return !isNaN(totalAds) ? total + totalAds : total;
        },
        0
      );

      settotalVerifiedAll(totalAdCountVerifiedFalse + totalAdCountVerified); // Output: 0
    } catch (error) {
      console.error("Error fetching data:", error);
      // setHasError(true);
    } finally {
      // setIsLoading(false);
    }
  }, [
    AdsCountPerRegion,
    make,
    AdsCountPerColor,
    AdsCountPerTransmission,
    AdsCountPerFuel,
    AdsCountPerCondition,
    AdsCountPerCC,
    AdsCountPerExchange,
    AdsCountPerBodyType,
    AdsCountPerRegistered,
    AdsCountPerSeats,
    AdsCountPersecondCondition,
    AdsCountPerVerifiedTrue,
    AdsCountPerVerifiedFalse,
    AdsCountPerlanduse,
    AdsCountPerfloors,
    AdsCountPerhouseclass,
    AdsCountPerbedrooms,
    AdsCountPerbathrooms,
    AdsCountPerfurnishing,
    AdsCountPeramenities,
    AdsCountPertoilets,
    AdsCountPerparking,
    AdsCountPerstatus,
    AdsCountPerarea,
    AdsCountPerpropertysecurity,
  ]);

  return (
    <>
      <ScrollArea className="h-[500px] w-full  bg-white rounded-t-md border p-1">
        <div className="flex flex-col items-center w-full">
          <div className="text-sm mt-2 w-full p-4">
            <div className="flex gap-1 items-center font-bold">
              <LocationOnIcon sx={{ fontSize: 16 }} />
              Location
            </div>
            <Dialog open={isOpen}>
              <DialogTrigger asChild>
                <div
                  onClick={() => openDialog()}
                  className="flex cursor-pointer text-sm text-gray-500 rounded-sm p-1 justify-between items-center"
                >
                  {selectedRegion}
                  <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>
                    <div className="text-sm w-full">
                      <div className="flex text-sm text-gray-950 w-full gap-1 items-center mt-1 mb-1">
                        All Kenya - {subcategory}
                        <div className="text-xs text-emerald-600">
                          |{" "}
                          {(AdsCountPerSubcategory &&
                            AdsCountPerSubcategory.find(
                              (item: { _id: string; adCount: number }) =>
                                item._id === subcategory
                            )?.adCount) ??
                            0}{" "}
                          ads
                        </div>
                      </div>
                    </div>
                  </DialogTitle>
                  <div className="w-full bg-white">
                    <div
                      onClick={closeDialog}
                      className="absolute top-2 right-2 z-30 bg-white"
                    >
                      <button className="bg-white">
                        <CloseIcon className="bg-white" sx={{ fontSize: 24 }} />
                      </button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="w-full">
                  <Command className="rounded-lg border">
                    <CommandInput placeholder="search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Regions">
                        <ScrollArea className="w-full h-full">
                          {AdsCountPerRegion &&
                            AdsCountPerRegion.map(
                              (region: any, index: number) => (
                                <>
                                  <CommandItem
                                    key={index}
                                    onSelect={() =>
                                      handleRegionClick(region._id)
                                    }
                                    // Attach onClick event handler
                                    className={`flex bg-white w-full p-1 text-sm border-b justify-between ${
                                      selectedRegion === region._id
                                        ? "bg-emerald-100"
                                        : "" // Highlight selected item
                                    }`}
                                  >
                                    <div> {region._id}</div>{" "}
                                    <div className="text-emerald-600 flex gap-1">
                                      {" "}
                                      {region.adCount} ads{" "}
                                      <ArrowForwardIosIcon
                                        sx={{ fontSize: 14 }}
                                      />
                                    </div>
                                  </CommandItem>
                                </>
                              )
                            )}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-sm mt-2 w-full p-4">
            <div className="flex gap-1 mb-1 items-center font-bold no-underline">
              <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
              Verified sellers
            </div>

            <div>
              <div className="w-full text-xs">
                <div className="flex w-full gap-2 p-1">
                  <input
                    className="cursor-pointer"
                    type="radio"
                    value="all"
                    checked={selectedOption === "all"}
                    onChange={(e) => handleChange("all")}
                  />
                  <div>Show All</div>
                  <div>|</div>
                  <div className="text-emerald-600 flex gap-1 mr-2">
                    {totalVerifiedAll}
                    <div>ads</div>
                  </div>
                </div>

                <div className="flex w-full gap-2 p-1">
                  <input
                    className="cursor-pointer"
                    type="radio"
                    value="verified"
                    checked={selectedOption === "verified"}
                    onChange={(e) => handleChange("verified")}
                  />
                  <div className="flex w-full gap-1 items-center mt-1 mb-1">
                    Verified sellers
                    <div className="flex text-xs gap-1 text-emerald-600">
                      |{" "}
                      {AdsCountPerVerifiedTrue.length > 0
                        ? AdsCountPerVerifiedTrue[0].totalAds
                        : 0}
                      <div>ads</div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-2 p-1">
                  <input
                    className="cursor-pointer"
                    type="radio"
                    value="unverified"
                    checked={selectedOption === "unverified"}
                    onChange={(e) => handleChange("unverified")}
                  />
                  <div className="flex w-full gap-1 items-center mt-1 mb-1">
                    Unverified sellers
                    <div className="flex text-xs gap-1 text-emerald-600">
                      |{" "}
                      {AdsCountPerVerifiedFalse.length > 0
                        ? AdsCountPerVerifiedFalse[0].totalAds
                        : 0}
                      <div>ads</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm mt-1 rounded-lg w-full bg-white p-4">
            <div className="grid grid-cols-2 gap-1">
              <TextField
                value={minPrice}
                label="Min Price*"
                className="text-sm"
                onChange={(e) => handlePriceChange(e.target.value, maxPrice)}
              />

              <TextField
                value={maxPrice}
                label="Max Price*"
                className="text-sm"
                onChange={(e) => handlePriceChange(minPrice, e.target.value)}
              />
            </div>
          </div>

          {subcategory === "Cars, Vans & Pickups" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleModels"
                    options={[{ make: "All" }, ...vehicleModels]}
                    getOptionLabel={(option) => option.make}
                    value={
                      vehicleModels.find(
                        (cond: any) => cond.make === selectedMakeOption
                      ) || null
                    }
                    //  onChange={(e) => handleMakeChange(e.target.value)}
                    onChange={(event, newValue) =>
                      handleMakeChange(newValue?.make || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.make}</span>
                        {option.make === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalMake}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(make &&
                                make.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.make
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Make*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Vehicle Parts & Accessories" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="automotivePartsCategories"
                    options={[{ name: "All" }, ...automotivePartsCategories]}
                    getOptionLabel={(option) => option.name}
                    value={
                      automotivePartsCategories.find(
                        (cond: any) => cond.name === selectedTypesOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleTypesChange(newValue?.name || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.name}</span>
                        {option.mane === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalTypes}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(Types &&
                                Types.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.name
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Type*" />
                    )}
                  />
                </div>
              </div>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="automotivePartsMakes"
                    options={[{ make: "All" }, ...automotivePartsMakes]}
                    getOptionLabel={(option) => option.make}
                    value={
                      automotivePartsMakes.find(
                        (cond: any) => cond.make === selectedMakeOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleMakeChange(newValue?.make || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.make}</span>
                        {option.make === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalMake}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(make &&
                                make.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.make
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Make*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Trucks & Trailers" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="truckTypes"
                    options={[{ type: "All" }, ...truckTypes]}
                    getOptionLabel={(option) => option.type}
                    value={
                      truckTypes.find(
                        (cond: any) => cond.type === selectedTypesOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleMakeChange(newValue?.type || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.type}</span>
                        {option.type === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalTypes}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(Types &&
                                Types.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.type
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Type*" />
                    )}
                  />
                </div>
              </div>

              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="truckMakes"
                    options={[{ make: "All" }, ...truckMakes]}
                    getOptionLabel={(option) => option.make}
                    value={
                      truckMakes.find(
                        (cond: any) => cond.make === selectedMakeOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleMakeChange(newValue?.make || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.make}</span>
                        {option.make === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalMake}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(make &&
                                make.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.make
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Make*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Heavy Equipment" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="equipmentTypes"
                    options={[{ type: "All" }, ...equipmentTypes]}
                    getOptionLabel={(option) => option.type}
                    value={
                      equipmentTypes.find(
                        (cond: any) => cond.type === selectedTypesOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleTypesChange(newValue?.type || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.type}</span>
                        {option.type === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalTypes}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(Types &&
                                Types.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.type
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Type*" />
                    )}
                  />
                </div>
              </div>

              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="equipmentMakes"
                    options={[{ make: "All" }, ...equipmentMakes]}
                    getOptionLabel={(option) => option.make}
                    value={
                      equipmentMakes.find(
                        (cond: any) => cond.make === selectedMakeOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleMakeChange(newValue?.make || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.make}</span>
                        {option.make === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalMake}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(make &&
                                make.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.make
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Make*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Motorbikes,Tuktuks & Scooters" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="motorcycleMakes"
                    options={[{ make: "All" }, ...motorcycleMakes]}
                    getOptionLabel={(option) => option.make}
                    value={
                      motorcycleMakes.find(
                        (cond: any) => cond.make === selectedMakeOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleMakeChange(newValue?.make || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.make}</span>
                        {option.make === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalMake}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(make &&
                                make.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.make
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Make*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Buses & Microbuses" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="BusesMake"
                    options={[{ make: "All" }, ...BusesMake]}
                    getOptionLabel={(option) => option.make}
                    value={
                      BusesMake.find(
                        (cond: any) => cond.make === selectedMakeOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleMakeChange(newValue?.make || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.make}</span>
                        {option.make === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalMake}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(make &&
                                make.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.make
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Make*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Watercraft & Boats" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="boatTypes"
                    options={[{ type: "All" }, ...boatTypes]}
                    getOptionLabel={(option) => option.type}
                    value={
                      boatTypes.find(
                        (cond: any) => cond.type === selectedTypesOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleTypesChange(newValue?.type || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.type}</span>
                        {option.type === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalTypes}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(Types &&
                                Types.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.type
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Type*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses" ||
            subcategory === "Motorbikes,Tuktuks & Scooters" ||
            subcategory === "Heavy Equipment" ||
            subcategory === "Trucks & Trailers" ||
            subcategory === "Watercraft & Boats") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-4">
                <div className="grid grid-cols-2 gap-1">
                  <Autocomplete
                    id="vehicleyearfrom"
                    options={years}
                    getOptionLabel={(option) => option}
                    value={years.find((yr) => yr === yearfrom) || null}
                    className="text-sm"
                    onChange={(event, newValue) =>
                      handleYearChange(newValue ?? "", yearto)
                    }
                    renderInput={(field) => (
                      <TextField {...field} label="From" className="text-xs" />
                    )}
                  />

                  <Autocomplete
                    id="vehicleyearto"
                    options={years}
                    getOptionLabel={(option) => option}
                    value={years.find((yr) => yr === yearto) || null}
                    onChange={(event, newValue) =>
                      handleYearChange(yearfrom, newValue ?? "")
                    }
                    renderInput={(field) => (
                      <TextField {...field} label="To" className="text-xs" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses" ||
            subcategory === "Motorbikes,Tuktuks & Scooters" ||
            subcategory === "Heavy Equipment" ||
            subcategory === "Trucks & Trailers" ||
            subcategory === "Vehicle Parts & Accessories" ||
            subcategory === "Watercraft & Boats") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleConditions"
                    options={["All", ...vehicleConditions]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleConditions.find(
                        (cond) => cond === selectedConditionOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleConditionChange(newValue || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalCondition}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerCondition &&
                                AdsCountPerCondition.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Conditions*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses" ||
            subcategory === "Motorbikes,Tuktuks & Scooters") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleColors"
                    options={["All", ...vehicleColors]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleColors.find(
                        (cond) => cond === selectedColorOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleColorChange(newValue || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalColor}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerColor &&
                                AdsCountPerColor.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Body Color*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses" ||
            subcategory === "Motorbikes,Tuktuks & Scooters" ||
            subcategory === "Trucks & Trailers") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleTransmissions"
                    options={["All", ...vehicleTransmissions]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleTransmissions.find(
                        (cond) => cond === selectedTransmissionOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleTransmissionChange(newValue || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalTransmission}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerTransmission &&
                                AdsCountPerTransmission.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Transmission*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleFuelTypes"
                    options={["All", ...vehicleFuelTypes]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleFuelTypes.find(
                        (cond) => cond === selectedFuelOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleFuelChange(newValue || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalFuel}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerFuel &&
                                AdsCountPerFuel.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Fuel*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Cars, Vans & Pickups" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleBodyTypes"
                    options={[{ type: "All" }, ...vehicleBodyTypes]}
                    getOptionLabel={(option) => option.type}
                    value={
                      vehicleBodyTypes.find(
                        (cond: any) => cond.type === selectedBodyOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleBodyChange(newValue?.type || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option.type}</span>
                        {option.type === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalBody}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerBodyType &&
                                AdsCountPerBodyType.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option.type
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Body Type*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Cars, Vans & Pickups" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleEngineSizesCC"
                    options={[
                      { _id: "All", adCount: totalCC },
                      ...AdsCountPerCC,
                    ]}
                    getOptionLabel={(option) => option._id}
                    value={
                      AdsCountPerCC.find(
                        (cond: any) => cond._id === selectedCCOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleCCChange(newValue?._id || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option._id}</span>

                        <span className="flex gap-1 text-xs text-emerald-600">
                          {option.adCount ?? 0}
                          <span>ads</span>
                        </span>
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Engine Size*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses" ||
            subcategory === "Motorbikes,Tuktuks & Scooters") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleRegistered"
                    options={["All", ...vehicleRegistered]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleRegistered.find(
                        (cond) => cond === selectedRegisteredOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleRegisteredChange(newValue || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalRegistered}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerRegistered &&
                                AdsCountPerRegistered.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Registered*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses" ||
            subcategory === "Motorbikes,Tuktuks & Scooters" ||
            subcategory === "Heavy Equipment" ||
            subcategory === "Trucks & Trailers" ||
            subcategory === "Watercraft & Boats") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleexchangeposible"
                    options={["All", ...vehicleRegistered]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleRegistered.find(
                        (cond) => cond === selectedExchangeOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleExchangeChange(newValue || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalExchange}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerExchange &&
                                AdsCountPerExchange.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Exchange Possible*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {subcategory === "Cars, Vans & Pickups" && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleSeats"
                    options={["All", ...vehicleSeats]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleSeats.find(
                        (cond) => cond === selectedSeatsOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleSeatsChange(newValue || "")
                    }
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalSeats}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPerSeats &&
                                AdsCountPerSeats.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Seats No*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {(subcategory === "Cars, Vans & Pickups" ||
            subcategory === "Buses & Microbuses") && (
            <>
              <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                <div className="w-full p-2">
                  <Autocomplete
                    id="vehicleSecondConditions"
                    options={["All", ...vehicleSecondConditions]}
                    getOptionLabel={(option) => option}
                    value={
                      vehicleSecondConditions.find(
                        (cond) => cond === selectedSecondOption
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleSecondChange(newValue || "")
                    }
                    //  onChange={(event, newValue) => {
                    //    setselectedSecondOption(newValue);
                    //  }}
                    renderOption={(props: any, option: any) => (
                      <div
                        {...props}
                        className="justify-between flex p-1 m-1 rounded-sm hover:cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm">{option}</span>
                        {option === "All" ? (
                          <>
                            {" "}
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {totalSecond}
                              <span>ads</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex gap-1 text-xs text-emerald-600">
                              {(AdsCountPersecondCondition &&
                                AdsCountPersecondCondition.find(
                                  (item: { _id: string; adCount: number }) =>
                                    item._id === option
                                )?.adCount) ??
                                0}
                              <span>ads</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    renderInput={(field) => (
                      <TextField {...field} label="Second Conditions*" />
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default SidebarSearchmobile;
