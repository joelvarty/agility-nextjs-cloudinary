import React from "react";
import { renderHTML } from "@agility/nextjs";
import Image from "next/image";
import dynamic from 'next/dynamic';

import { getImageObj, getOptimizedImage, getVideoObj, nextImageLoader } from "../../lib/cloudinary-tools"

const Video = dynamic(() => import('../common/Video'), { ssr: false });

const PostDetails = ({ dynamicPageItem, customData }) => {

	const { cloud_name } = customData

	// post fields
	const post = dynamicPageItem.fields;

	// category
	const category = post.category?.fields.title || "Uncategorized";

	// format date
	const dateStr = new Date(post.date).toLocaleDateString();

	let imageSrc = post.image?.url || null;

	// post image alt
	let imageAlt = post.image?.label || null;

	//************************************************************
	//NEW cloudinary image!!!
	let cloudinaryImageID = null
	if (post.featuredImage) {

		//if we have a cloudinary image...
		const cldImage = getImageObj(post.featuredImage)
		cloudinaryImageID = cldImage.public_id
		imageAlt = cldImage.alt
		imageSrc = getOptimizedImage({ cloud_name, public_id: cloudinaryImageID, width: 500 })
	}

	//NEW cloudinary video
	let cloudinaryVideoID = null
	if (post.cloudinaryVideo) {
		const cldVideo = getVideoObj(post.cloudinaryVideo)
		cloudinaryVideoID = cldVideo.public_id
	}

	//************************************************************

	return (
		<div className="relative px-8">
			<div className="max-w-screen-xl mx-auto">
				<div className="h-64 md:h-96 relative">
					<Image
						src={imageSrc}
						alt={imageAlt}
						className="object-cover object-center rounded-lg"
						layout="fill"
						loader={({ src, width, height }) => nextImageLoader({ public_id: cloudinaryImageID, src, width, height, cloud_name })}

					/>
				</div>
				<div className="max-w-2xl mx-auto mt-4">
					<div className="uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose">
						{category}
					</div>
					<div className="border-b-2 border-primary-500 w-8"></div>
					<div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">
						{dateStr}
					</div>
					<h1 className="font-display text-4xl font-bold my-6 text-secondary-500">
						{post.title}
					</h1>
					{cloudinaryVideoID &&
						<div className="rounded-md relative mb-4">
							<Video cloudName={cloud_name} public_id={cloudinaryVideoID} />
						</div>
					}
					<div
						className="prose max-w-full mb-20"
						dangerouslySetInnerHTML={renderHTML(post.content)}
					/>
				</div>
			</div>
		</div>
	);
};


PostDetails.getCustomInitialProps = async () => {
	return {
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME
	}
}

export default PostDetails;
