const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const listRoutes = () => {
  console.log("\n🔍 CHECKING BACKEND ROUTES\n");
  
  const routes = [
    "GET /api/doctors/get-doctors",
    "GET /api/doctors/get-pending-doctors",
    "GET /api/doctors/get-doctor-profile",
    "POST /api/doctors/applyfordoctor",
    "POST /api/doctors/acceptdoctor",
    "POST /api/doctors/rejectdoctor",
    "GET /api/appointment/doctor-appointments",
    "GET /api/appointment/user-appointments",
    "GET /api/appointment/admin-appointments"
  ];

  routes.forEach(route => {
    console.log(`✅ Should exist: ${route}`);
  });

  console.log("\n📝 Make sure all these routes are in your route files");
  process.exit(0);
};

listRoutes();