window.onload = () => {
  detect();
};


async function detect() {
  const barcodeDetector = new BarcodeDetector();
  const h2 = document.getElementById("scan")
  const list = document.getElementById("barcodes");
  let itemsFound = [];
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: {facingMode: { ideal: "environment"}}
  });

  const video = document.createElement("video");
  video.srcObject = mediaStream;
  video.autoplay = true;
  video.videoWidth = "100vw";
  video.videoHeight = "300px";

  h2.before(video);


  function render() {
    barcodeDetector
      .detect(video)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          if (!itemsFound.includes(barcode.rawValue)) {
            itemsFound.push(barcode.rawValue);
            const li = document.createElement("li");
            li.innerHTML = product.name;
            const newBarcode = barcode.rawValue; 
            list.appendChild(li);
            const getURL = 'https://world.openfoodfacts.org/api/v0/product/' + newBarcode+ '.json'
            fetch(getURL).then(response => response.json())
            .then(response => {
                console.log(response.product)
        
                const product = {
                    name: response.product.product_name,
                    brand: response.product.brand_owner,
                    nutriscore: response.product.nutrient_levels.fat,
                    img: response.product.image_front_url
                }
        
                const markup = `
         <div class="person">
                <img src=${product.img}>
                <h2>${product.name} </h2>
            <h3>
                ${product.brand}
            </h3>
            <p class="location">${product.nutriscore}</p>
         </div>
        `;
        
        document.querySelector("main section:nth-of-type(1)").innerHTML = markup;    
            })
            .catch(error => document.body.insertAdjacentHTML('beforebegin', error))
          }
        });
      })
      .catch(console.error);
  }

// barcode getter

// const barcode = "li.innerHTML";

  (function renderLoop() {
    requestAnimationFrame(renderLoop);
    render();
  })();
}

