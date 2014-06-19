user: {
	id:
	group:
	username:
	password:
	salt:
	firstname:
	lastname:
	email:
	code:
	ip:
	status:
	dateAdded:
}



category: {
	id:
	image:
	description: [{
		language:
		name:
		description:
		metaDescription:
		metaKeyword:
	}]
	parent:
	top:
	column:
	sortOrder:
	status:
	dateAdded:
	dateModified:
}

country: {
	id:
	name:
	isoCode2:
	isoCode3:
	addressFormat:
	postcodeRequired:
	Status:
}

currency: {
	id:
	title:
	code:
	symbolLeft:
	symbolRight:
	decimalPlace:
	value:
	status:
	dateModified:
}

customer: {
	id:
	firstname:
	lastname:
	email:
	telephone:
	password:
	salt:
	cart:
	wishlist:
	newsletter:
	addresses: {

	}
	groups: {


	}
	ips: {

	}
	additionalFields: {

	}
	status:
	approved:
	token:
	dateAdded:
}

extensions: {
	id:
	code:
	type:	
}

order: {
	id:
	invoice:
	invoicePrefix:
	customerId:
	customerGroup:
	firstname:
	lastname:
	email:
	telephone:
	comment:
	total:
	totals: [{
		code:
		title:
		text:
		value:
		sortOrder:
	}]
	status:
	affiliate:
	commission:
	language:
	currency: {
		id:
		code:
		value:
	}
	ip:
	forwardedIp:
	userAgent:
	payment: {
		firstname:
		lastname:
		company:
		tax:
		address:
		city:
		postcode:
		country:
		zone:
		addressFormat:
		method:
		code:
	}
	shipping: {
		firstname:
		lastname:
		address:
		city:
		postcode:
		country:
		zone:
		addressFormat:
		method:
		code:
	}
	dateAdded:
	dateModified:
}

product:{
	id:
	description: [{
		language:
		name:
		description:
		metaDescription:
		metaKeyword:
		tag: []
	}]
	model:
	sku:
	upc:
	ean:
	jan:
	isbn:
	mpn:
	location:
	quantity:
	stockStatus:
	images: [{
		image:
		sortOrder:
	}]
	manufacturer:
	shipping:
	price:
	points:
	taxClass:
	dateAvailable:
	weight:
	weightClass:
	length:
	width:
	height:
	lengthClass:
	attributes: [{

	}]
	options: [{

	}]
	subtract:
	minimum:
	sortOrder:
	status:
	dateAdded:
	dateModified:
	viewed:
}

setting: {
	id:
	group:
	key:
	value:
}

config: {
	
}

urlAlias:{
	id:
	query:
	keyword:
}