import React, { Component } from 'react'
import { AdvancedVideo  } from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/base";
import { getVideoPosterUrl } from "lib/cloudinary-tools"

const Video = ({public_id, cloudName, className }) => {
	const myCld = new Cloudinary({ cloud: {  cloudName } });
	const video = myCld.video(public_id)

	const posterUrl = getVideoPosterUrl({ public_id, cloud_name: cloudName })

	 return (
	 	<AdvancedVideo autoPlay={false} controls cldVid={video} className={className}  poster={posterUrl} />
	 )

}

export default Video
