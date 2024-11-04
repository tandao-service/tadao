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

const SidebarSearch = ({
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
  const handleShowMore = () => {
    setShowMore(true);
  };
  const handleQuery = (index: number, query: string) => {
    let newUrl = "";
    if (query) {
      newUrl = formUrlQuerymultiple({
        params: "",
        updates: {
          category: category.toString(),
          subcategory: query.toString(),
        },
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["subcategory"],
      });
    }
    setQuery(query);
    router.push(newUrl, { scroll: false });
  };

  const [selectedRegion, setSelectedRegion] = useState("All Kenya");

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

  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");

  const [activerange, setactiverange] = useState(20);
  const handlePrice = (index: number, min: string, max: string) => {
    setactiverange(index);
    let newUrl = "";
    if (min) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "Price",
        value: min + "-" + max,
      });
      setminPrice(min);
      setmaxPrice(max);
    } else {
      setminPrice("");
      setmaxPrice("");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["Price"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

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

  const [selectedYearOption, setselectedYearOption] = useState("all");

  const [selectedTypesOption, setselectedTypesOption] = useState("all");

  const [selectedhouseclassOption, setselectedhouseclassOption] =
    useState("all");

  const handlehouseclassChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedhouseclassOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "houseclass",
        value: event.target.value,
      });
    } else {
      setselectedhouseclassOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["houseclass"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [selectedfloorsOption, setselectedfloorsOption] = useState("all");

  const handlefloorsChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedfloorsOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "floors",
        value: event.target.value,
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

  const handlepropertysecurityChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedpropertysecurityOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "propertysecurity",
        value: event.target.value,
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

  const handlelanduseChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedlanduseOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "landuse",
        value: event.target.value,
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

  const handleareaChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedareaOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "area",
        value: event.target.value,
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

  const handlestatusChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedstatusOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "status",
        value: event.target.value,
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

  const handleparkingChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedparkingOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "parking",
        value: event.target.value,
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

  const handletoiletsChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedtoiletsOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "toilets",
        value: event.target.value,
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

  const handleamenitiesChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedamenitiesOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "amenities",
        value: event.target.value,
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

  const handlefurnishingChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedfurnishingOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "furnishing",
        value: event.target.value,
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

  const handlebathroomsChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedbathroomsOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "bathrooms",
        value: event.target.value,
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

  const handlebedroomsChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedbedroomsOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "bedrooms",
        value: event.target.value,
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

  const handleTypesChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedTypesOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "Types",
        value: event.target.value,
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

  const handleMakeChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedMakeOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "make",
        value: event.target.value,
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

  const handleSecondChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedSecondOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclesecordCondition",
        value: event.target.value,
      });
    } else {
      setselectedSecondOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclesecordCondition"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleSeatsChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedSeatsOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleSeats",
        value: event.target.value,
      });
    } else {
      setselectedSeatsOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleSeats"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleExchangeChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedExchangeOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleexchangeposible",
        value: event.target.value,
      });
    } else {
      setselectedExchangeOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleexchangeposible"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleRegisteredChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedRegisteredOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleregistered",
        value: event.target.value,
      });
    } else {
      setselectedRegisteredOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleregistered"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleCCChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedCCOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleEngineSizesCC",
        value: event.target.value,
      });
    } else {
      setselectedCCOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleEngineSizesCC"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleYearChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedYearOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleyear",
        value: event.target.value,
      });
    } else {
      setselectedYearOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleyear"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const handleBodyChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedBodyOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleBodyTypes",
        value: event.target.value,
      });
    } else {
      setselectedBodyOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleBodyTypes"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleFuelChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedFuelOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleFuelTypes",
        value: event.target.value,
      });
    } else {
      setselectedFuelOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleFuelTypes"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleTransmissionChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedTransmissionOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehicleTransmissions",
        value: event.target.value,
      });
    } else {
      setselectedTransmissionOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehicleTransmissions"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleColorChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedColorOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclecolor",
        value: event.target.value,
      });
    } else {
      setselectedColorOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclecolor"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleConditionChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      setselectedConditionOption(event.target.value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclecondition",
        value: event.target.value,
      });
    } else {
      setselectedConditionOption("all");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclecondition"],
      });
    }

    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const handleChange = (event: any) => {
    let newUrl = "";

    if (event.target.value) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "membership",
        value: event.target.value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["membership"],
      });
    }
    setSelectedOption(event.target.value);
    router.push(newUrl, { scroll: false });
    //alert(event.target.value);
  };

  const [vehicleyearfrom, setvehicleyearfrom] = useState("");
  const [vehicleyearto, setvehicleyearto] = useState("");
  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }

  const handlebutton = () => {
    let newUrl = "";

    if (minPrice && maxPrice) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "Price",
        value: minPrice + "-" + maxPrice,
      });
    } else {
      setminPrice("");
      setmaxPrice("");
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["Price"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const onSelectPriceClear = () => {
    let newUrl = "";
    newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["Price"],
    });

    setminPrice("");
    setmaxPrice("");
    setactiverange(20);
    router.push(newUrl, { scroll: false });
  };
  const onSelectYear = () => {
    let newUrl = "";

    if (vehicleyearfrom && vehicleyearto) {
      newUrl = formUrlQuerymultiple({
        params: searchParams.toString(),
        updates: {
          yearfrom: vehicleyearfrom,
          yearto: vehicleyearto,
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
  const onSelectYearClear = () => {
    let newUrl = "";

    newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["yearfrom", "yearto"],
    });

    router.push(newUrl, { scroll: false });
  };
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
      <div className="flex flex-col items-center min-w-[280px] w-full">
        {/* <div className="w-full rounded-sm bg-gray-100 p-0 mb-2">
          <CategoryFilterSearch />
        </div> */}
        <div className="flex flex-col text-white items-center rounded-t-lg w-full p-1 bg-emerald-950">
          Category
        </div>
        <div className="w-full p-1 bg-white rounded-b-lg">
          <div className="flex flex-col p-1 text-sm font-bold rounded-t-lg w-full">
            <div className="flex w-full gap-1 items-center mt-1 mb-1">
              <ClassOutlinedIcon sx={{ fontSize: 16 }} /> {category}{" "}
              <div className="text-xs text-emerald-600">
                |{" "}
                {categoryList &&
                  categoryList.find((cat: any) => cat.name === category)
                    ?.adCount}{" "}
                ads
              </div>
            </div>
          </div>
          <div className="ml-3">
            {categoryList &&
              categoryList
                .find((cat: any) => cat.name === category)
                ?.subcategory.slice(
                  0,
                  showMore
                    ? categoryList.find((cat: any) => cat.name === category)
                        ?.subcategory.length
                    : itemsToShow
                )
                .map((sub: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleQuery(index, sub.title)}
                    className={`flex items-center w-full justify-between p-1 rounded-sm mb-1 text-sm cursor-pointer hover:bg-emerald-100 hover:text-emerald-600 ${
                      query === sub.title
                        ? "bg-emerald-600 text-white hover:text-white hover:bg-emerald-600"
                        : ""
                    }`}
                  >
                    <div className="flex w-full gap-1 items-center">
                      {sub.title}
                      <div
                        className={`flex text-xs gap-1 text-emerald-600 ${
                          query === sub.title ? "text-white" : ""
                        }`}
                      >
                        <div>|</div>
                        <div className="flex gap-1">
                          {(AdsCountPerSubcategory &&
                            AdsCountPerSubcategory.find(
                              (item: { _id: string; adCount: number }) =>
                                item._id === sub.title
                            )?.adCount) ??
                            0}

                          <div>ads</div>
                        </div>
                      </div>
                    </div>

                    <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                  </div>
                ))}
            {!showMore &&
              categoryList &&
              categoryList.find((cat: any) => cat.name === category)
                ?.subcategory.length > 4 && (
                <button
                  onClick={handleShowMore}
                  className="text-sm text-emerald-600 hover:underline focus:outline-none"
                >
                  Show More
                </button>
              )}
          </div>
        </div>
        <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
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
                                  onSelect={() => handleRegionClick(region._id)}
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

        <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger>
                <div className="flex gap-1 items-center font-bold">
                  <CreditScoreOutlinedIcon sx={{ fontSize: 16 }} />
                  Price
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="flex grid grid-cols-2  gap-1 justify-between">
                    <div className="w-full text-sm px-0 py-2">
                      <TextField
                        value={minPrice}
                        label="Min Price*"
                        className="w-[120px] text-sm"
                        onChange={(e) => setminPrice(e.target.value)}
                      />
                    </div>

                    <div className="w-[120px] px-0 py-2">
                      <TextField
                        value={maxPrice}
                        label="Max Price*"
                        className="w-full text-sm"
                        onChange={(e) => setmaxPrice(e.target.value)}
                      />
                    </div>
                    <div className="w-[120px]">
                      <button
                        type="submit"
                        onClick={() => onSelectPriceClear()}
                        className="bg-gray-400 w-full p-1 text-xs rounded-sm text-white h-full"
                      >
                        <CloseIcon
                          className="text-white"
                          sx={{ fontSize: 24 }}
                        />{" "}
                        Clear Price
                      </button>
                    </div>
                    <div className="w-[120px]">
                      <button
                        type="submit"
                        onClick={() => handlebutton()}
                        className="bg-[#30AF5B] w-full p-1 text-xs rounded-sm text-white h-full"
                      >
                        <SearchIcon /> Search Price
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger>
                <div className="flex gap-1 items-center font-bold no-underline">
                  {" "}
                  <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                  Verified sellers
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="w-full text-xs">
                    <div className="flex w-full gap-2 p-1">
                      <input
                        className="cursor-pointer"
                        type="radio"
                        value="all"
                        checked={selectedOption === "all"}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {subcategory === "Cars, Vans & Pickups" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Make
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Vehicle Make">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedMakeOption === "all"}
                                    onChange={handleMakeChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalMake}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {vehicleModels &&
                                vehicleModels.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle.make}
                                            checked={
                                              selectedMakeOption ===
                                              vehicle.make
                                            }
                                            onChange={handleMakeChange}
                                          />
                                          <div> {vehicle.make}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(make &&
                                            make.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle.make
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Vehicle Parts & Accessories" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Type
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Type">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedTypesOption === "all"}
                                    onChange={handleTypesChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalTypes}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {automotivePartsCategories &&
                                automotivePartsCategories.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle.name}
                                            checked={
                                              selectedTypesOption ===
                                              vehicle.name
                                            }
                                            onChange={handleTypesChange}
                                          />
                                          <div> {vehicle.name}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(Types &&
                                            Types.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle.name
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Make
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Make">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedMakeOption === "all"}
                                    onChange={handleMakeChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalMake}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {automotivePartsMakes &&
                                automotivePartsMakes.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle.make}
                                            checked={
                                              selectedMakeOption ===
                                              vehicle.make
                                            }
                                            onChange={handleMakeChange}
                                          />
                                          <div> {vehicle.make}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(make &&
                                            make.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle.make
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Trucks & Trailers" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Type
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Type">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedTypesOption === "all"}
                                    onChange={handleTypesChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalTypes}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {truckTypes &&
                                truckTypes.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle.type}
                                            checked={
                                              selectedTypesOption ===
                                              vehicle.type
                                            }
                                            onChange={handleTypesChange}
                                          />
                                          <div> {vehicle.type}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(Types &&
                                            Types.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle.type
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Make
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Vehicle Make">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedMakeOption === "all"}
                                    onChange={handleMakeChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalMake}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {truckMakes &&
                                truckMakes.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle}
                                            checked={
                                              selectedMakeOption === vehicle
                                            }
                                            onChange={handleMakeChange}
                                          />
                                          <div> {vehicle}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(make &&
                                            make.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Heavy Equipment" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Type
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Type">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedTypesOption === "all"}
                                    onChange={handleTypesChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalTypes}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {equipmentTypes &&
                                equipmentTypes.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle.type}
                                            checked={
                                              selectedTypesOption ===
                                              vehicle.type
                                            }
                                            onChange={handleTypesChange}
                                          />
                                          <div> {vehicle.type}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(Types &&
                                            Types.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle.type
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Make
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Vehicle Make">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedMakeOption === "all"}
                                    onChange={handleMakeChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalMake}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {equipmentMakes &&
                                equipmentMakes.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle.make}
                                            checked={
                                              selectedMakeOption ===
                                              vehicle.make
                                            }
                                            onChange={handleMakeChange}
                                          />
                                          <div> {vehicle.make}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(make &&
                                            make.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle.make
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Motorbikes,Tuktuks & Scooters" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Make
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Vehicle Make">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedMakeOption === "all"}
                                    onChange={handleMakeChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalMake}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {motorcycleMakes &&
                                motorcycleMakes.map(
                                  (vehicle: any, index: number) => (
                                    <>
                                      <CommandItem
                                        key={index}
                                        className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                      >
                                        <div className="flex gap-1 items-center">
                                          <input
                                            className="cursor-pointer"
                                            type="radio"
                                            value={vehicle.make}
                                            checked={
                                              selectedMakeOption ===
                                              vehicle.make
                                            }
                                            onChange={handleMakeChange}
                                          />
                                          <div> {vehicle.make}</div>
                                        </div>
                                        <div className="text-emerald-600 flex gap-1 mr-2">
                                          {(make &&
                                            make.find(
                                              (item: {
                                                _id: string;
                                                adCount: number;
                                              }) => item._id === vehicle.make
                                            )?.adCount) ??
                                            0}

                                          <div>ads</div>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Buses & Microbuses" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Make
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Vehicle Make">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedMakeOption === "all"}
                                    onChange={handleMakeChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalMake}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {BusesMake &&
                                BusesMake.map((vehicle: any, index: number) => (
                                  <>
                                    <CommandItem
                                      key={index}
                                      className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                    >
                                      <div className="flex gap-1 items-center">
                                        <input
                                          className="cursor-pointer"
                                          type="radio"
                                          value={vehicle.make}
                                          checked={
                                            selectedMakeOption === vehicle.make
                                          }
                                          onChange={handleMakeChange}
                                        />
                                        <div> {vehicle.make}</div>
                                      </div>
                                      <div className="text-emerald-600 flex gap-1 mr-2">
                                        {(make &&
                                          make.find(
                                            (item: {
                                              _id: string;
                                              adCount: number;
                                            }) => item._id === vehicle.make
                                          )?.adCount) ??
                                          0}

                                        <div>ads</div>
                                      </div>
                                    </CommandItem>
                                  </>
                                ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Watercraft & Boats" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16 }} />
                      Type
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <Command className="rounded-lg border">
                        <CommandInput placeholder="search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Type">
                            <ScrollArea className="w-full h-[250px] bg-white">
                              <CommandItem
                                className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                              >
                                <div className="flex gap-1 items-center">
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="all"
                                    checked={selectedTypesOption === "all"}
                                    onChange={handleTypesChange}
                                  />
                                  <div> Show All</div>
                                </div>
                                <div className="text-emerald-600 flex gap-1 mr-2">
                                  {totalTypes}
                                  <div>ads</div>
                                </div>
                              </CommandItem>
                              {boatTypes &&
                                boatTypes.map((vehicle: any, index: number) => (
                                  <>
                                    <CommandItem
                                      key={index}
                                      className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                    >
                                      <div className="flex gap-1 items-center">
                                        <input
                                          className="cursor-pointer"
                                          type="radio"
                                          value={vehicle.type}
                                          checked={
                                            selectedTypesOption === vehicle.type
                                          }
                                          onChange={handleTypesChange}
                                        />
                                        <div> {vehicle.type}</div>
                                      </div>
                                      <div className="text-emerald-600 flex gap-1 mr-2">
                                        {(Types &&
                                          Types.find(
                                            (item: {
                                              _id: string;
                                              adCount: number;
                                            }) => item._id === vehicle.type
                                          )?.adCount) ??
                                          0}

                                        <div>ads</div>
                                      </div>
                                    </CommandItem>
                                  </>
                                ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
                      Year of Manufacture
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <div className="flex grid grid-cols-2 mb-2 justify-between">
                        <div className="w-[120px] text-xs  px-0 py-2">
                          <Autocomplete
                            id="vehicleyearfrom"
                            options={years}
                            getOptionLabel={(option) => option}
                            value={
                              years.find((yr) => yr === vehicleyearfrom) || null
                            }
                            onChange={(event, newValue) => {
                              setvehicleyearfrom(newValue ?? "");
                            }}
                            renderInput={(field) => (
                              <TextField
                                {...field}
                                label="From"
                                className="text-xs"
                              />
                            )}
                          />
                        </div>

                        <div className="w-[120px] px-0 py-2 text-xs">
                          <Autocomplete
                            id="vehicleyearto"
                            options={years}
                            getOptionLabel={(option) => option}
                            value={
                              years.find((yr) => yr === vehicleyearto) || null
                            }
                            onChange={(event, newValue) => {
                              setvehicleyearto(newValue ?? "");
                            }}
                            renderInput={(field) => (
                              <TextField
                                {...field}
                                label="To"
                                className="text-xs"
                              />
                            )}
                          />
                        </div>

                        <div className="w-[120px]">
                          <button
                            type="submit"
                            onClick={() => onSelectYearClear()}
                            className="bg-gray-400 text-xs w-full p-1 rounded-sm text-white h-full"
                          >
                            <CloseIcon
                              className="text-white"
                              sx={{ fontSize: 24 }}
                            />{" "}
                            Clear Year
                          </button>
                        </div>
                        <div className="w-[120px]">
                          <button
                            type="submit"
                            onClick={() => onSelectYear()}
                            className="bg-[#30AF5B] text-xs  w-full p-1 rounded-sm text-white h-full"
                          >
                            <SearchIcon /> Search Year
                          </button>
                        </div>
                      </div>
                      <div className="w-full">
                        <Command className="rounded-lg border">
                          <CommandInput placeholder="search..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Year">
                              <ScrollArea className="w-full h-[250px] bg-white">
                                <CommandItem
                                  // Attach onClick event handler
                                  className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                >
                                  <div className="flex gap-1">
                                    <input
                                      className="cursor-pointer"
                                      type="radio"
                                      value="all"
                                      checked={selectedYearOption === "all"}
                                      onChange={handleYearChange}
                                    />
                                    <div> Show All</div>
                                  </div>
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    {totalYear}
                                    <div>ads</div>
                                  </div>
                                </CommandItem>
                                {AdsCountPerYear &&
                                  AdsCountPerYear.map(
                                    (yr: any, index: number) => (
                                      <>
                                        <CommandItem
                                          key={index}
                                          // Attach onClick event handler
                                          className={`flex bg-white w-full p-1 text-xs border-b justify-between ${
                                            selectedYearOption === yr._id
                                              ? "bg-emerald-100"
                                              : "" // Highlight selected item
                                          }`}
                                        >
                                          <div className="flex gap-1">
                                            <input
                                              className="cursor-pointer"
                                              type="radio"
                                              value={yr._id}
                                              onChange={handleYearChange}
                                              checked={
                                                selectedYearOption === yr._id
                                              }
                                            />
                                            <div> {yr._id}</div>{" "}
                                          </div>
                                          <div className="text-emerald-600 flex gap-1">
                                            {" "}
                                            {yr.adCount} ads{" "}
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <SignalWifiStatusbarNullOutlinedIcon
                        sx={{ fontSize: 16 }}
                      />
                      Conditions
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <div className="flex w-full gap-2 text-xs p-1">
                          <input
                            className="cursor-pointer"
                            type="radio"
                            value="all"
                            checked={selectedConditionOption === "all"}
                            onChange={handleConditionChange}
                          />
                          <div> Show All</div> <div>|</div>
                          <div className="text-emerald-600 flex gap-1 mr-2">
                            {totalCondition}
                            <div>ads</div>
                          </div>
                        </div>

                        {vehicleConditions &&
                          vehicleConditions.map(
                            (vehicle: any, index: number) => (
                              <>
                                <div
                                  key={index}
                                  className="flex w-full gap-2 text-xs p-1"
                                >
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value={vehicle}
                                    onChange={handleConditionChange}
                                    checked={
                                      selectedConditionOption === vehicle
                                    }
                                  />
                                  <div> {vehicle}</div>{" "}
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    <div>|</div>
                                    {(AdsCountPerCondition &&
                                      AdsCountPerCondition.find(
                                        (item: {
                                          _id: string;
                                          adCount: number;
                                        }) => item._id === vehicle
                                      )?.adCount) ??
                                      0}

                                    <div>ads</div>
                                  </div>
                                </div>
                              </>
                            )
                          )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {(subcategory === "Cars, Vans & Pickups" ||
          subcategory === "Buses & Microbuses" ||
          subcategory === "Motorbikes,Tuktuks & Scooters") && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <FormatPaintOutlinedIcon sx={{ fontSize: 16 }} />
                      Body Color
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <Command className="rounded-lg border">
                          <CommandInput placeholder="search..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Body Color">
                              <ScrollArea className="w-full h-[250px] bg-white">
                                <CommandItem
                                  // Attach onClick event handler
                                  className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                >
                                  <div className="flex gap-1 items-center">
                                    <input
                                      className="cursor-pointer"
                                      type="radio"
                                      value="all"
                                      checked={selectedColorOption === "all"}
                                      onChange={handleColorChange}
                                    />
                                    <div> Show All</div>
                                  </div>
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    {totalColor}
                                    <div>ads</div>
                                  </div>
                                </CommandItem>
                                {vehicleColors &&
                                  vehicleColors.map(
                                    (color: any, index: number) => (
                                      <>
                                        <CommandItem
                                          key={index}
                                          className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                        >
                                          <div className="flex gap-1 items-center">
                                            <input
                                              className="cursor-pointer"
                                              type="radio"
                                              value={color}
                                              onChange={handleColorChange}
                                              checked={
                                                selectedColorOption === color
                                              }
                                            />
                                            <div>{color}</div>
                                          </div>
                                          <div className="text-emerald-600 flex gap-1 mr-2">
                                            {(AdsCountPerColor &&
                                              AdsCountPerColor.find(
                                                (item: {
                                                  _id: string;
                                                  adCount: number;
                                                }) => item._id === color
                                              )?.adCount) ??
                                              0}

                                            <div>ads</div>
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {(subcategory === "Cars, Vans & Pickups" ||
          subcategory === "Buses & Microbuses" ||
          subcategory === "Motorbikes,Tuktuks & Scooters" ||
          subcategory === "Trucks & Trailers") && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <FormatStrikethroughOutlinedIcon sx={{ fontSize: 16 }} />
                      Transmission
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <div className="flex w-full gap-2 text-xs p-1">
                          <input
                            className="cursor-pointer"
                            type="radio"
                            value="all"
                            checked={selectedTransmissionOption === "all"}
                            onChange={handleTransmissionChange}
                          />
                          <div> Show All</div> <div>|</div>
                          <div className="text-emerald-600 flex gap-1 mr-2">
                            {totalTransmission}
                            <div>ads</div>
                          </div>
                        </div>

                        {vehicleTransmissions &&
                          vehicleTransmissions.map(
                            (vehicle: any, index: number) => (
                              <>
                                <div
                                  key={index}
                                  className="flex w-full gap-2 text-xs p-1"
                                >
                                  <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value={vehicle}
                                    onChange={handleTransmissionChange}
                                    checked={
                                      selectedTransmissionOption === vehicle
                                    }
                                  />
                                  <div> {vehicle}</div>{" "}
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    <div>|</div>
                                    {(AdsCountPerTransmission &&
                                      AdsCountPerTransmission.find(
                                        (item: {
                                          _id: string;
                                          adCount: number;
                                        }) => item._id === vehicle
                                      )?.adCount) ??
                                      0}

                                    <div>ads</div>
                                  </div>
                                </div>
                              </>
                            )
                          )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {(subcategory === "Cars, Vans & Pickups" ||
          subcategory === "Buses & Microbuses") && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <InvertColorsOutlinedIcon sx={{ fontSize: 16 }} />
                      Fuel
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <Command className="rounded-lg border">
                          <CommandInput placeholder="search..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Fuel Type">
                              <ScrollArea className="w-full h-[250px] bg-white">
                                <CommandItem
                                  // Attach onClick event handler
                                  className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                >
                                  <div className="flex gap-1 items-center">
                                    <input
                                      className="cursor-pointer"
                                      type="radio"
                                      value="all"
                                      checked={selectedFuelOption === "all"}
                                      onChange={handleFuelChange}
                                    />
                                    <div> Show All</div>
                                  </div>
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    {totalFuel}
                                    <div>ads</div>
                                  </div>
                                </CommandItem>
                                {vehicleFuelTypes &&
                                  vehicleFuelTypes.map(
                                    (fuel: any, index: number) => (
                                      <>
                                        <CommandItem
                                          key={index}
                                          className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                        >
                                          <div className="flex gap-1 items-center">
                                            <input
                                              className="cursor-pointer"
                                              type="radio"
                                              value={fuel}
                                              onChange={handleFuelChange}
                                              checked={
                                                selectedFuelOption === fuel
                                              }
                                            />
                                            <div>{fuel}</div>
                                          </div>
                                          <div className="text-emerald-600 flex gap-1 mr-2">
                                            {(AdsCountPerFuel &&
                                              AdsCountPerFuel.find(
                                                (item: {
                                                  _id: string;
                                                  adCount: number;
                                                }) => item._id === fuel
                                              )?.adCount) ??
                                              0}

                                            <div>ads</div>
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Cars, Vans & Pickups" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
                      Body Type
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <Command className="rounded-lg border">
                          <CommandInput placeholder="search..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Body Type">
                              <ScrollArea className="w-full h-[250px] bg-white">
                                <CommandItem
                                  // Attach onClick event handler
                                  className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                >
                                  <div className="flex gap-1 items-center">
                                    <input
                                      className="cursor-pointer"
                                      type="radio"
                                      value="all"
                                      checked={selectedBodyOption === "all"}
                                      onChange={handleBodyChange}
                                    />
                                    <div> Show All</div>
                                  </div>
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    {totalBody}
                                    <div>ads</div>
                                  </div>
                                </CommandItem>
                                {vehicleBodyTypes &&
                                  vehicleBodyTypes.map(
                                    (body: any, index: number) => (
                                      <>
                                        <CommandItem
                                          key={index}
                                          className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                        >
                                          <div className="flex gap-1 items-center">
                                            <input
                                              className="cursor-pointer"
                                              type="radio"
                                              value={body}
                                              onChange={handleBodyChange}
                                              checked={
                                                selectedBodyOption === body.type
                                              }
                                            />
                                            <div>{body.type}</div>
                                          </div>
                                          <div className="text-emerald-600 flex gap-1 mr-2">
                                            {(AdsCountPerBodyType &&
                                              AdsCountPerBodyType.find(
                                                (item: {
                                                  _id: string;
                                                  adCount: number;
                                                }) => item._id === body.type
                                              )?.adCount) ??
                                              0}

                                            <div>ads</div>
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Cars, Vans & Pickups" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <InsightsOutlinedIcon sx={{ fontSize: 16 }} />
                      Engine Size
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <Command className="rounded-lg border">
                          <CommandInput placeholder="search..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Engine Size CC">
                              <ScrollArea className="w-full h-[250px] bg-white">
                                <CommandItem
                                  // Attach onClick event handler
                                  className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                >
                                  <div className="flex gap-1">
                                    <input
                                      className="cursor-pointer"
                                      type="radio"
                                      value="all"
                                      checked={selectedCCOption === "all"}
                                      onChange={handleCCChange}
                                    />
                                    <div> Show All</div>
                                  </div>
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    {totalCC}
                                    <div>ads</div>
                                  </div>
                                </CommandItem>
                                {AdsCountPerCC &&
                                  AdsCountPerCC.map(
                                    (cc: any, index: number) => (
                                      <>
                                        <CommandItem
                                          key={index}
                                          // Attach onClick event handler
                                          className={`flex bg-white w-full p-1 text-xs border-b justify-between ${
                                            selectedRegion === cc._id
                                              ? "bg-emerald-100"
                                              : "" // Highlight selected item
                                          }`}
                                        >
                                          <div className="flex gap-1">
                                            <input
                                              className="cursor-pointer"
                                              type="radio"
                                              value={cc._id}
                                              onChange={handleCCChange}
                                              checked={
                                                selectedCCOption === cc._id
                                              }
                                            />
                                            <div> {cc._id}</div>{" "}
                                          </div>
                                          <div className="text-emerald-600 flex gap-1">
                                            {" "}
                                            {cc.adCount} ads{" "}
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {(subcategory === "Cars, Vans & Pickups" ||
          subcategory === "Buses & Microbuses" ||
          subcategory === "Motorbikes,Tuktuks & Scooters") && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 16 }} />
                      Registered
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <div
                        // Attach onClick event handler
                        className="flex w-full gap-2 text-xs p-1"
                      >
                        <div className="flex gap-1 items-center">
                          <input
                            className="cursor-pointer"
                            type="radio"
                            value="all"
                            checked={selectedRegisteredOption === "all"}
                            onChange={handleRegisteredChange}
                          />
                          <div> Show All</div>
                        </div>
                        <div className="text-emerald-600 flex gap-1 mr-2">
                          {totalRegistered}
                          <div>ads</div>
                        </div>
                      </div>
                      {vehicleRegistered &&
                        vehicleRegistered.map((vehicle: any, index: number) => (
                          <>
                            <div
                              key={index}
                              className="flex w-full gap-2 text-xs p-1"
                            >
                              <input
                                className="cursor-pointer"
                                type="radio"
                                value={vehicle}
                                onChange={handleRegisteredChange}
                                checked={selectedRegisteredOption === vehicle}
                              />
                              <div> {vehicle}</div>{" "}
                              <div className="text-emerald-600 flex gap-1 mr-2">
                                <div>|</div>
                                {(AdsCountPerRegistered &&
                                  AdsCountPerRegistered.find(
                                    (item: { _id: string; adCount: number }) =>
                                      item._id === vehicle
                                  )?.adCount) ??
                                  0}

                                <div>ads</div>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <HowToRegOutlinedIcon sx={{ fontSize: 16 }} />
                      Exchange Possible
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <div
                        // Attach onClick event handler
                        className="flex w-full gap-2 text-xs p-1"
                      >
                        <div className="flex gap-1 items-center">
                          <input
                            className="cursor-pointer"
                            type="radio"
                            value="all"
                            checked={selectedExchangeOption === "all"}
                            onChange={handleExchangeChange}
                          />
                          <div> Show All</div>
                        </div>
                        <div className="text-emerald-600 flex gap-1 mr-2">
                          {totalExchange}
                          <div>ads</div>
                        </div>
                      </div>
                      {vehicleRegistered &&
                        vehicleRegistered.map((vehicle: any, index: number) => (
                          <>
                            <div
                              key={index}
                              className="flex w-full gap-2 text-xs p-1"
                            >
                              <input
                                className="cursor-pointer"
                                type="radio"
                                value={vehicle}
                                onChange={handleExchangeChange}
                                checked={selectedExchangeOption === vehicle}
                              />
                              <div> {vehicle}</div>{" "}
                              <div className="text-emerald-600 flex gap-1 mr-2">
                                <div>|</div>
                                {(AdsCountPerExchange &&
                                  AdsCountPerExchange.find(
                                    (item: { _id: string; adCount: number }) =>
                                      item._id === vehicle
                                  )?.adCount) ??
                                  0}

                                <div>ads</div>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {subcategory === "Cars, Vans & Pickups" && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <AirlineSeatReclineExtraOutlinedIcon
                        sx={{ fontSize: 16 }}
                      />
                      Seats No
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <Command className="rounded-lg border">
                          <CommandInput placeholder="search..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Seats No">
                              <ScrollArea className="w-full h-[250px] bg-white">
                                <CommandItem
                                  // Attach onClick event handler
                                  className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                >
                                  <div className="flex gap-1 items-center">
                                    <input
                                      className="cursor-pointer"
                                      type="radio"
                                      value="all"
                                      checked={selectedSeatsOption === "all"}
                                      onChange={handleSeatsChange}
                                    />
                                    <div> Show All</div>
                                  </div>
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    {totalSeats}
                                    <div>ads</div>
                                  </div>
                                </CommandItem>
                                {vehicleSeats &&
                                  vehicleSeats.map(
                                    (seats: any, index: number) => (
                                      <>
                                        <CommandItem
                                          key={index}
                                          className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                        >
                                          <div className="flex gap-1 items-center">
                                            <input
                                              className="cursor-pointer"
                                              type="radio"
                                              value={seats}
                                              onChange={handleSeatsChange}
                                              checked={
                                                selectedSeatsOption === seats
                                              }
                                            />
                                            <div>{seats}</div>
                                          </div>
                                          <div className="text-emerald-600 flex gap-1 mr-2">
                                            {(AdsCountPerSeats &&
                                              AdsCountPerSeats.find(
                                                (item: {
                                                  _id: string;
                                                  adCount: number;
                                                }) => item._id === seats
                                              )?.adCount) ??
                                              0}

                                            <div>ads</div>
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {(subcategory === "Cars, Vans & Pickups" ||
          subcategory === "Buses & Microbuses") && (
          <>
            <div className="text-sm mt-2 rounded-lg w-full bg-white p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold no-underline">
                      {" "}
                      <SignalWifiStatusbarConnectedNoInternet4OutlinedIcon
                        sx={{ fontSize: 16 }}
                      />
                      Second Condition
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="w-full">
                        <Command className="rounded-lg border">
                          <CommandInput placeholder="search..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Second Condition">
                              <ScrollArea className="w-full h-[250px] bg-white">
                                <CommandItem
                                  // Attach onClick event handler
                                  className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                >
                                  <div className="flex gap-1 items-center">
                                    <input
                                      className="cursor-pointer"
                                      type="radio"
                                      value="all"
                                      checked={selectedSecondOption === "all"}
                                      onChange={handleSecondChange}
                                    />
                                    <div> Show All</div>
                                  </div>
                                  <div className="text-emerald-600 flex gap-1 mr-2">
                                    {totalSecond}
                                    <div>ads</div>
                                  </div>
                                </CommandItem>
                                {vehicleSecondConditions &&
                                  vehicleSecondConditions.map(
                                    (cond: any, index: number) => (
                                      <>
                                        <CommandItem
                                          key={index}
                                          className={`flex bg-white w-full p-1 text-xs border-b justify-between `}
                                        >
                                          <div className="flex gap-1 items-center">
                                            <input
                                              className="cursor-pointer"
                                              type="radio"
                                              value={cond}
                                              onChange={handleSecondChange}
                                              checked={
                                                selectedSecondOption === cond
                                              }
                                            />
                                            <div>{cond}</div>
                                          </div>
                                          <div className="text-emerald-600 flex gap-1 mr-2">
                                            {(AdsCountPersecondCondition &&
                                              AdsCountPersecondCondition.find(
                                                (item: {
                                                  _id: string;
                                                  adCount: number;
                                                }) => item._id === cond
                                              )?.adCount) ??
                                              0}

                                            <div>ads</div>
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidebarSearch;
