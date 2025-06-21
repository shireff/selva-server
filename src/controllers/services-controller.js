import { validationResult } from "express-validator";
import Service from "../modals/serviceModel.js";
import path from "path";

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    const services = await Service.find(query);

    res.json({
      services,
      categories: ["Manicure", "Pedicure", "Extensions", "Nail Art", "Repair"],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imageUrl = "";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const newService = new Service({
      ...req.body,
      image: imageUrl,
    });

    await newService.save();

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    // Fetch the existing service to retain the old image if no new image is provided
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Validation checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imageUrl = service.image; 
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    // Update the service with the new data
    service.name = req.body.name || service.name;
    service.description = req.body.description || service.description;
    service.price = req.body.price || service.price;
    service.duration = req.body.duration || service.duration;
    service.category = req.body.category || service.category;
    service.features = req.body.features
      ? req.body.features.split(",")
      : service.features;
    service.isPopular =
      req.body.isPopular !== undefined ? req.body.isPopular : service.isPopular;
    service.image = imageUrl;

    await service.save();

    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
