import React, { Component } from 'react'
import { AdvancedVideo  } from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/base";


const Video = ({public_id, cloudName, className }) => {
	const myCld = new Cloudinary({ cloud: {  cloudName } });
	const video = myCld.video(public_id)

	 return (
	 	<AdvancedVideo autoPlay={false} controls cldVid={video} className={className}  />
	 )

}

export default Video
