
export const nextImageLoader = ({public_id, cloud_name, src, width, height}) => {

	if (! public_id) {
		//standard agility image...
		return `${src}?w=${width}&h=${height}`
	} else {
		//super cloudinary image :)
		return getOptimizedImage({public_id, cloud_name, width, height})

	}


}
export const getOptimizedImage = ({public_id, cloud_name, width, height}) => {

	//only use height if it's sent in...
	const hstr = height ? `,h_${height}` : ''



	return `https://res.cloudinary.com/${cloud_name}/image/upload/c_fill,g_auto,w_${width}${hstr},f_auto/${public_id}.jpg`

}

export const getImageObj = (fieldValue) => {

	//EX: {"url":"http://res.cloudinary.com/agility-cms/image/upload/v1623182094/canadian_mdwvkt.jpg","public_id":"canadian_mdwvkt","resource_type":"image","secure_url":"https://res.cloudinary.com/agility-cms/image/upload/v1623182094/canadian_mdwvkt.jpg","width":1200,"height":830,"bytes":143582,"duration":null,"alt":"Person in a canoe"}

	const obj = JSON.parse(fieldValue)
	return obj

}

export const getVideoObj = (fieldValue) => {
	const obj = JSON.parse(fieldValue)
	return obj
}

export const getSocialImage = ({cloud_name, public_id, title, src, width, height }) => {

	if (! public_id) return `${src}?w=${width}&h=${height}`

	const titleTxt = encodeURIComponent(title)

	return `https://res.cloudinary.com/${cloud_name}/image/upload/c_fill,g_south_east,l_${public_id},r_20,w_500,x_50,y_50/c_fit,e_shadow:40,g_north_west,h_600,l_text:Source Sans Pro_120_bd:${titleTxt},w_900,x_100,y_150/v1623187283/bg/social-bg-1.png`

}