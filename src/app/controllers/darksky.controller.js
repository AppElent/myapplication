const path = require("path");

const fetch = require("node-fetch");

const darksky_api_key = '09cbbe0257a566a4aa20e1c8e0be4757';
const darksky_location = '52.21860580000001, 5.280716600000005';
const darksky_host = 'https://api.darksky.net';
const darksky_region_settings = '?units=auto&lang=nl';


exports.getCurrentData = async (req, res) => {
	var url = darksky_host + '/forecast/' + darksky_api_key + '/' + darksky_location + darksky_region_settings;
	console.log(url);
	var data = await fetch(url);
	res.send(await data.json());
}

exports.getDateData = async (req, res) => {
	var date = moment(req.params.date);
	var url = darksky_host + '/forecast/' + darksky_api_key + '/' + darksky_location + ', ' + date/1000 + darksky_region_settings;
	console.log(url);
	var data = await fetch(url);
	res.send(await data.json());
}
