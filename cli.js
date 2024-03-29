#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';


const args = minimist(process.argv.slice(2));

if (args.h){
    try{
        console.log(`
            Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
                -h            Show this help message and exit.
                -n, -s        Latitude: N positive; S negative.
                -e, -w        Longitude: E positive; W negative.
                -z            Time zone: uses tz.guess() from moment-timezone by default.
                -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
                -j            Echo pretty JSON from open-meteo API and exit.
            `)
        process.exit(0);
    }catch(err){
        process.exit(1);
    }
}

const timezone = moment.tz.guess();
const latitude = args.n || (-1 * args.s);
const longitude = args.e || (-1 * args.w);

// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m,weathercode,windspeed_120m,winddirection_120m&daily=weathercode,precipitation_hours&temperature_unit=fahrenheit&timezone=' + timezone);
// Get the data from the request
const data = await response.json();

if (args.j){
    console.log(data);
    process.exit(0);
}


const days = args.d; 
if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}