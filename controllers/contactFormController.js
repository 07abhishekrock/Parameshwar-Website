const express = require("express");
const validator = require("validator");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

const ContactForm = require('../models/ContactUsModel');

exports.addContactForm = catchAsync(async (req,res,next)=>{
	const contact_form = await ContactForm.create({
		name:req.body.name,
		email : req.body.email,
		phoneNo : req.body.phoneNo,
		address:req.body.address || '',
		aadharNumber:req.body.aadharNumber || '',
		fatherName:req.body.fatherName || '',
        query:req.body.query || ''
	})
	res.status(200).json({
		status : 'success',
		data : contact_form		
	})
})

exports.getPaginatedQueries = catchAsync(async (req,res,next)=>{
	const skip = req.query.pageIndex * 10 || 0;
	const queries = await ContactForm.find({},(err, data)=>{
		console.log(data);
	}).skip(skip).limit(10);
	if(!queries.length){
		return res.status(200).json({
		  status:'failure',
		  error:'No more Queries Found'
		})
	 }
	 else{
		res.status(200).json({
		  status:"success",
		  result:queries.length,
		  data:queries
		})
	 }
})

exports.deleteQuery = catchAsync(async (req,res,next)=>{
	const query = await ContactForm.findByIdAndDelete(req.params.id);
	if (!query) {
	  return next(new AppError("No product found with this ID", 404));
	}
 
	res.status(200).json({
	  status: "success",
	  data: null,
	});
})