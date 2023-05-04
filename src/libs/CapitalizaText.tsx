import { link } from "joi";

export function capitalizeFirstLetter(str: string) {
  return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function trimAndDashToLower(str: string) {
  return str.trim().replace(/\s+/g, "-").toLowerCase();
}


export function trimToTwoDecimalPlaces(input: any) {
  const decimalIndex = input.indexOf('.');
  
  if (decimalIndex !== -1) {
    // Check if there are more than two digits after the decimal point
    if (input.substring(decimalIndex+1).length > 2) {
      // Limit to two digits after the decimal point
      return input.substring(0, decimalIndex+3);
    }
  }

  return input;
}

export function SetToUpperCase(str:string) {
  return str.toUpperCase();
}

export function replaceSpacesWithDashes(str: string) {
  return str.replace(/\s+/g, '-').trim();
}



export function imgUpload(): void {
  let input = document.createElement('file-upload') as HTMLInputElement;
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const encodedImg = reader.result?.toString().replace(/^data:(.*;base64,)?/, '') ?? '';
      const img = document.getElementById('img-show-upload') as HTMLImageElement;
      if (img) {
        img.src = `data:image/png;base64,${encodedImg}`;
      }
    //console.log(`data:image/png;base64,${encodedImg}`)

    };
  };
  input.click();
}

export const handleFileUpload = (e:any) => {
  const files = e.target.files as FileList;
  const file = files[0];
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    const imgPreview = document.getElementById("img-show-upload") as HTMLImageElement;
    imgPreview.src = e.target?.result as string;
    imgPreview.style.display = "block";
  };

  reader.readAsDataURL(file);
}


export const NumberFixedtoDigit = (num:any) =>{
  return parseFloat(num).toFixed(2);
}