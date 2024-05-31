import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { InputState } from "./typesAndInterfaces";

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

export const savePDF = async (
  userName: string | undefined,
  setCurrentUserData: { (userData: InputState): void; (arg0: any): void },
  currentUserData: InputState
) => {
  try {
    const capture = document.querySelector(".write-blues-changes");
    if (!capture) throw new Error("Element not found");

    const canvas = await html2canvas(capture as HTMLElement);
    const imgData = canvas.toDataURL("image/jpeg");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
    const pdfBlob = pdf.output("blob");
    const storageRef = ref(storage, `${userName}-write-blues-changes.pdf`);

    // awaiting Promise
    await uploadBytes(storageRef, pdfBlob);
    console.log("PDF uploaded successfully");

    // awaiting Promise
    const url = await getDownloadURL(storageRef);
    console.log("URL: ", url);

    console.log(
      "currentUserData from savePDF before setCurrentUserData: ",
      currentUserData
    );
    setCurrentUserData({ ...currentUserData, bluesUrl: url });
    console.log(
      "currentUserData from savePDF after setCurrentUserData: ",
      currentUserData
    );
  } catch (error) {
    console.error("Error in savePDF: ", error);
  }
};
