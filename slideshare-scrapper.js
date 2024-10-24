/**
 * ========================================================================
 * SlideShare Presentation Downloader
 * ========================================================================
 * 
 * DSS - Advanced Security & Digital Forensics - ENU '25
 * 
 * Purpose: Educational resource acquisition tool for academic purposes.
 * This tool is designed to help students download educational content
 * for offline study and research purposes.
 * 
 * License: MIT - Promoting open-source education and knowledge sharing
 * ========================================================================
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => reject(err));
        });
    });
}

(async () => {
    try {
        const browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: null
        });
        const page = await browser.newPage();

        // Navigate to the SlideShare presentation
        const slideshareUrl = 'https://www.slideshare.net/slideshow/interventional-radiology-part-1-78638764/78638764';
        await page.goto(slideshareUrl, { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });

        // Wait for initial load - using the new class structure
        await page.waitForSelector('.VerticalSlide_root__jU_9r', { 
            timeout: 60000 
        });

        const downloadDir = path.resolve(__dirname, 'slides_hq');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }

        const totalSlides = 128; // Known total number of slides
        const slideUrls = [];

        for (let slideNumber = 0; slideNumber < totalSlides; slideNumber++) {
            console.log(`Processing slide ${slideNumber + 1} of ${totalSlides}...`);
            
            try {
                // Get the high-res image URL using the dynamic slide-image-X selector
                const imageUrl = await page.evaluate((currentSlide) => {
                    const img = document.querySelector(`#slide-image-${currentSlide}`);
                    if (!img) return null;
                    
                    // Try to get srcset first
                    const srcset = img.getAttribute('srcset');
                    if (srcset) {
                        const urls = srcset.split(',')
                            .map(s => s.trim().split(' ')[0])
                            .filter(url => url.startsWith('http'));
                        return urls[urls.length - 1] || urls[0];
                    }
                    
                    // Fallback to src
                    return img.src;
                }, slideNumber);

                if (imageUrl) {
                    const slideFilename = path.resolve(downloadDir, `slide_${String(slideNumber + 1).padStart(3, '0')}.jpg`);
                    
                    try {
                        await downloadImage(imageUrl, slideFilename);
                        console.log(`Slide ${slideNumber + 1} downloaded successfully`);
                        slideUrls.push(imageUrl);

                        // Scroll to next slide to trigger loading
                        await page.evaluate((currentSlide) => {
                            const nextSlide = document.querySelector(`#slide${currentSlide + 2}`); // +2 because slide IDs start at 1
                            if (nextSlide) {
                                nextSlide.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, slideNumber);

                        // Fixed: Replaced waitForTimeout with Promise-based delay
                        await new Promise(resolve => setTimeout(resolve, 1500));

                    } catch (err) {
                        console.error(`Error downloading slide ${slideNumber + 1}:`, err);
                    }
                } else {
                    console.log(`Could not find image URL for slide ${slideNumber + 1}`);
                }
            } catch (err) {
                console.error(`Error processing slide ${slideNumber + 1}:`, err);
            }
        }

        fs.writeFileSync(
            'slide_urls_hq.json', 
            JSON.stringify(slideUrls, null, 2)
        );
        
        console.log('Scraping completed successfully');
        console.log(`Total slides downloaded: ${slideUrls.length}`);
        
        await browser.close();
        
    } catch (err) {
        console.error('An error occurred:', err);
        process.exit(1);
    }
})();