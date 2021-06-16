const express = require("express");
const Users = require("./../models/userModel");
const validator = require("validator");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

exports.getAdmin = catchAsync(async (req,res,next)=>{
	const users = await Users.find({role:"admin"},(err, data)=>{
		console.log(data);
	});
	if(!users.length){
		return res.status(200).json({
		  status:'failure',
		  error:'No more admins Found'
		})
	 }
	 else{
		res.status(200).json({
		  status:"success",
		  result:users.length,
		  data:users
		})
	 }
})

exports.getPaginatedUsers = catchAsync(async (req,res,next)=>{
	const skip = req.query.pageIndex * 10 || 0;
	const users = await Users.find({role:"user"},(err, data)=>{
		console.log(data);
	}).skip(skip).limit(10);
	if(!users.length){
		return res.status(200).json({
		  status:'failure',
		  error:'No more Users Found'
		})
	 }
	 else{
		res.status(200).json({
		  status:"success",
		  result:users.length,
		  data:users
		})
	 }
})

exports.deleteUser = catchAsync(async (req,res,next)=>{
	const user = await Users.findByIdAndDelete(req.params.id);
	if (!user) {
	  return next(new AppError("No product found with this ID", 404));
	}
 
	res.status(200).json({
	  status: "success",
	  data: null,
	});
})

exports.addNonAdminUser = catchAsync(async (req,res,next)=>{
	const user = await Users.create({
		name:req.body.name,
		email : req.body.email,
		phoneNo : req.body.phoneNo,
		role:'user'
	})
	res.status(200).json({
		status : 'success',
		data : user		
	})
})