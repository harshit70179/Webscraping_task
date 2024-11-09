const db = require("../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

exports.addTask=async(req,res)=>{
    try {
        const { url } = req.body;
        if (!url) return res.status(400).send({status:false,message:'URL is required'});
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const logo = $('link[rel="icon"]').attr('href') || $('img[alt*="logo"]').attr('src') || '';
        const name = $('title').text() || '';
        const emails = [];
        const phoneNumbers = [];
        let address = '';
        const socialLinks = {
            facebook: [],
            twitter: [],
            linkedin: [],
            instagram: []
        };
        $('a[href^="mailto:"]').each((_, element) => {
            const email = $(element).attr('href').replace('mailto:', '').trim();
            if (email && !emails.includes(email)) emails.push(email);
        });
        
        $('a[href^="tel:"]').each((_, element) => {
            const phone = $(element).attr('href').replace('tel:', '').trim();
            if (phone) phoneNumbers.push(phone);
        });
        if ($('address').length) {
            address = $('address').text().trim();
        } else {
            // Search for address in elements with common class or id names
            const addressSelectors = ['.address', '#address', '.location', '.contact-info','Visit'];
            for (const selector of addressSelectors) {
                if ($(selector).length) {
                    address = $(selector).text().trim();
                    break;
                }
            }
        }
        $('a[href]').each((_, element) => {
            const href = $(element).attr('href');
            if (href.includes('facebook.com')) socialLinks.facebook.push(href);
            else if (href.includes('twitter.com')) socialLinks.twitter.push(href);
            else if (href.includes('linkedin.com')) socialLinks.linkedin.push(href);
            else if (href.includes('instagram.com')) socialLinks.instagram.push(href);
        });
        const timeStamp=(new Date())/1000
        const screenShort=await  captureScreenshot(url,`./public/${timeStamp}_img.png`)
        const insertquery="INSERT INTO task(name,email,mobile_number,logo,description,address,facebook_url,twitter_url,linkedin_url,instagram_url,screen_shot,website) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"
        const insertRow=await dbQueryAsync(insertquery,[name,JSON.stringify(emails),JSON.stringify(phoneNumbers),logo,metaDescription,address,socialLinks.facebook,socialLinks.twitter,socialLinks.linkedin,socialLinks.instagram,process.env.ImagebaseUrl+`${timeStamp}_img.png`,url])
        if(insertRow){
            return res.status(200).send({status:true,message:"Data save successfully"})
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

async function captureScreenshot(url, savePath) {
    return new Promise(async(resolve, reject) => {
        
        try {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 500 });
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            await page.screenshot({ path: savePath, fullPage: true });
            await browser.close();
            resolve(savePath)
        } catch (error) {
            console.error("Error capturing screenshot:", error);
        }
    })
}

exports.getTask=async(req,res)=>{
    try {
        const getQuery="SELECT * FROM task"
        const getData=await dbQueryAsync(getQuery)
        if(getData.length>0){
            return res.send({status:true,message:"Record found successfully",data:getData})
        }
        else{
            return res.send({status:false,message:"No record found"})
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

exports.getTaskById=async(req,res)=>{
    try {
        const id=req.params.id
        const getQuery="SELECT * FROM task WHERE id=?"
        const getData=await dbQueryAsync(getQuery,[id])
        if(getData.length>0){
            return res.send({status:true,message:"Record found successfully",data:getData})
        }
        else{
            return res.send({status:false,message:"No record found"})
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}


exports.deleteTask=async(req,res)=>{
    try {
        const {ids}=req.body
        if(ids.length>0){
          const deleteQuery="DELETE FROM task WHERE id IN (?)"
          const deleteRow=await dbQueryAsync(deleteQuery,[ids])
          if(deleteRow){
            return res.send({status:true,message:"Deleted rows successfully"})
          }
        }
        else{
            return res.send({status:false,message:"Please select atleast one row"})
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}