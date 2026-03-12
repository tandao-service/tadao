//import { vehicleModels } from "@/constants/vehicleModels";

import { vehicleModels } from "@/constants";

// Function to add a new model to a specific make
export function addModelToMake(make: string, newModel: string) {
  const vehicleMake = vehicleModels.find((vehicle) => vehicle.make === make);

  if (vehicleMake) {
    // Check if the model already exists to avoid duplicates
    if (!vehicleMake.models.includes(newModel)) {
      vehicleMake.models.push(newModel);
    }
  } else {
    // If the make does not exist, you could add a new make with the model
    vehicleModels.push({
      make: make,
      models: [newModel],
    });
  }
}

// Call the function to add "Hilux" to Toyota

//console.log(vehicleModels);
