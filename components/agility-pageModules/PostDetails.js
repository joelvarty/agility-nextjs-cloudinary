import React from "react";
import Head from "next/head";
import { renderHTML } from "@agility/nextjs";
import Image from "next/image";
import dynamic from 'next/dynamic';
import truncate from "truncate-html";

import { getImageObj, getOptimizedImage, getVideoObj, nextImageLoader, getSocialImage } from "../../lib/cloudinary-tools"

const Video = dynamic(() => import('../common/Video'), { ssr: false });

const PostDetails = ({ dynamicPageItem, customData }) => {

	const { cloud_name } = customData

	// post fields
	const post = dynamicPageItem.fields;

	// category
	const category = post.category?.fields.title || "Uncategorized";

	// format date
	const dateStr = new Date(post.date).toLocaleDateString();

	const description = truncate(post.content, {
		length: 160,
		decodeEntities: true,
		stripTags: true,
		reserveLastWord: true,
	});

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

	let ogImageSrc = getSocialImage({
		src: imageSrc,
		title: post.title,
		cloud_name,
		public_id: cloudinaryImageID,
		width: 1600,
		height: 900 })

	let imageHeight = 900
	let imageWidth = 1600

	//NEW cloudinary video
	let cloudinaryVideoID = null
	if (post.cloudinaryVideo) {
		const cldVideo = getVideoObj(post.cloudinaryVideo)
		cloudinaryVideoID = cldVideo.public_id
	}

	//************************************************************

	return (
		<>
			<Head>
				<meta property="twitter:image" content={ogImageSrc} />
				<meta property="twitter:card" content="summary_large_image" />
				<meta name="og:title" content={post.title} />
				<meta property="og:image" content={ogImageSrc} />
				<meta property="og:image:width" content={imageWidth} />
				<meta property="og:image:height" content={imageHeight} />
				<meta name="description" content={description} />
				<meta name="og:description" content={description} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:title" content={post.title} />
			</Head>
			<div className="relative px-8">

				<div className="max-w-screen-xl mx-auto">
					<div className="h-64 md:h-96 aspect-w-16 aspect-h-9 relative">
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
							<div className="relative mb-4 rounded-md">
								<Video cloudName={cloud_name} public_id={cloudinaryVideoID} className="rounded-md" style="border-radius: 20px" />
							</div>
						}
						<div
							className="prose max-w-full mb-20"
							dangerouslySetInnerHTML={renderHTML(post.content)}
						/>
					</div>
				</div>
			</div>
		</>
	);
};


PostDetails.getCustomInitialProps = async () => {
	return {
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME
	}
}

export default PostDetails;
