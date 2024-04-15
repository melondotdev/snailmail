import React, { useRef, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";
import Frame1 from '../../assets/frame1.png';
import Frame2 from '../../assets/frame2.png';
import Frame3 from '../../assets/frame3.png';
import Frame4 from '../../assets/frame4.png';

const TextToImage = ({
  chosenTemplateIndex,
  fontColor,
  fontSize,
  font,
  fontBold,
  fontItalic,
  text,
  setBlob,
}) => {
  const previewRef = useRef(null);
  
  // Initialize mailTemplates using useMemo
  const mailTemplates = useMemo(() => [
    Frame1,
    Frame2,
    Frame3,
    Frame4,
  ], []);
  
  useEffect(() => {
    const generateImage = () => {
      html2canvas(previewRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const dataURLtoBlob = (dataurl) => {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], {type:mime});
        }
        
        const blob = dataURLtoBlob(imgData);
        
        setBlob(blob);
      });
    };
    
    generateImage();
  }, [chosenTemplateIndex, fontBold, fontColor, fontItalic, fontSize, mailTemplates, text, setBlob])
  
  return (
    <div
      ref={previewRef}
    >
      <img src={mailTemplates[chosenTemplateIndex]} alt={`frame${chosenTemplateIndex + 1}`} className="min-w-96 min-h-96" />
      <div className="absolute inset-0 p-16 text-wrap flex items-center justify-center">
        <p className={`text-center ${fontSize} ${font} ${fontBold ? 'font-bold' : ''} ${fontItalic ? 'italic' : ''}`} style={{ color: fontColor }}>{text}</p>
      </div>
    </div>
  );
}

export default TextToImage;
