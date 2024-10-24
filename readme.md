# SlideShare Presentation Downloader

A Node.js-based tool for downloading educational content from SlideShare presentations for offline study purposes. 

## 🎯 Purpose

This tool was developed to help students download educational content for offline study and research purposes. It's particularly useful for:
- Downloading presentations for offline access
- Creating local backups of educational materials
- Enabling study in areas with limited internet connectivity

## 🚀 Features

- Downloads high-resolution slides from SlideShare presentations
- Automatically handles slide navigation
- Saves slides in sequential order
- Maintains original image quality
- Creates a JSON file with all slide URLs
- Supports error handling and logging

## 📋 Prerequisites

Before running this tool, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

## 📦 Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/slideshare-downloader.git
cd slideshare-downloader
```

2. Install dependencies:
```bash
npm install
```

## 🔍 Identifying Correct Selectors

Before using the script, you need to verify and potentially update the CSS selectors as they might change over time. Here's how to find the correct selectors:

1. Open your target SlideShare presentation
2. Right-click on any slide and select "Inspect Element" (or press F12)
3. Look for the HTML structure of the slides. In the current version, it follows this pattern:
   ```html
   <div id="slide1" class="VerticalSlide_root__jU_9r slide-item">
     <div class="VerticalSlideImage_root__64KSA">
       <img id="slide-image-0" ...>
   ```

4. You need to update three key selectors in the script:
   - The main slide container class (currently `VerticalSlide_root__jU_9r`)
   - The image container class (currently `VerticalSlideImage_root__64KSA`)
   - The image ID pattern (currently `slide-image-X` where X is the slide number)

5. To update these in the script:
   ```javascript
   // Update this selector
   await page.waitForSelector('.VerticalSlide_root__jU_9r', { 
       timeout: 60000 
   });

   // Update this selector in the evaluate function
   const img = document.querySelector(`#slide-image-${currentSlide}`);
   ```

### 🔍 How to Find Your Selectors:

1. **Finding Container Classes**:
   - Look for a repeating pattern of divs that contain each slide
   - The classes might be different but will follow a similar structure
   - They often have randomized suffixes (like `__jU_9r`) which may change

2. **Finding Image IDs**:
   - Look for the `<img>` tags within the slide containers
   - Note how their IDs increment (e.g., `slide-image-0`, `slide-image-1`)

3. **Testing Your Selectors**:
   - In the browser console, you can test selectors:
   ```javascript
   document.querySelector('.YourNewClassName')
   document.querySelector('#slide-image-0')
   ```

## ⚙️ Configuration

1. Open `index.js`
2. Update the selectors as identified above
3. Modify the `slideshareUrl` variable with your target presentation URL
4. Adjust the `totalSlides` variable to match your presentation's length

## 🖥️ Usage

1. Run the script:
```bash
node index.js
```

2. The script will:
   - Create a `slides_hq` directory for downloaded images
   - Download all slides sequentially
   - Create a `slide_urls_hq.json` file with all image URLs

## 📝 Output

- Images are saved in the `slides_hq` directory
- Files are named sequentially (e.g., `slide_001.jpg`, `slide_002.jpg`)
- A JSON file (`slide_urls_hq.json`) contains all slide URLs

## ⚠️ Important Notes

1. **Educational Use Only**: This tool is intended for educational purposes only
2. **Rate Limiting**: The script includes delays to prevent overwhelming the server
3. **Error Handling**: Failed downloads are logged but don't stop the process
4. **Browser Window**: The script runs in non-headless mode for better stability


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🔧 Troubleshooting

Common issues and solutions:

1. **Script stops unexpectedly**
   - Check your internet connection
   - Verify the total number of slides
   - Increase timeout values if necessary
   - **Verify class names and selectors** are correct for your version of SlideShare

2. **Images not downloading**
   - Verify the presentation URL is accessible
   - Check folder permissions
   - Ensure sufficient disk space
   - **Double-check the image selectors** in the browser inspector

3. **Selector Errors**
   - If you get errors about elements not being found, the class names might have changed
   - Follow the "Identifying Correct Selectors" section to update them
   - Test new selectors in the browser console before updating the script

**DSS - Advanced Security & Digital Forensics ENU '25**