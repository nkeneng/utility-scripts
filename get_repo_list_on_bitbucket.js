// Function to fetch the data and parse the hrefs
async function getHrefsFromValues(page_number,workspace) {
  let url = `https://bitbucket.org/!api/2.0/repositories/${workspace}?page=${page_number}&pagelen=100&sort=-updated_on&q=&fields=-values.owner%2C-values.workspace`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const values = data.values;
    const hrefs = values.map(value => value.links.clone[1].href);
    return hrefs;
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return null;
  }
}

async function fetchAndCombineHrefs() {
  let hrefs = await getHrefsFromValues(1);
  let hrefs_2 = await getHrefsFromValues(5);
  let combined_hrefs = hrefs.concat(hrefs_2);
  return combined_hrefs;
}

async function downloadHrefs() {
  let combined_hrefs = await fetchAndCombineHrefs();
  // Convert combined_hrefs array into a string, with each link on a new line
  const hrefsText = combined_hrefs.join('\n');

  // Create a Blob from the hrefsText
  const blob = new Blob([hrefsText], { type: 'text/plain' });

  // Create a URL for the Blob
  const href = URL.createObjectURL(blob);

  // Create an anchor element and trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = href;
  downloadLink.download = 'links.txt'; // Name of the file to be downloaded
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up by revoking the Blob URL and removing the anchor element
  URL.revokeObjectURL(href);
  document.body.removeChild(downloadLink);
}

// Run the function to download the file
downloadHrefs();
