import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteSingleImage } from "@/lib/actions/ad.actions";
import Image from "next/image";
import AddBoxIcon from "@mui/icons-material/AddBox";
type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void;
  imageUrls: string[];
  userName: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploaderMobile({
  imageUrls,
  userName,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [showMessage, setMessage] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const acceptedFiles = Array.from(files).filter((file) => {
      if (imageUrls.includes(convertFileToUrl(file))) {
        setMessage(`${file.name} has already been uploaded.`);
        setShowAlert(true);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage(
          `${file.name} exceeds the 5MB limit and will not be uploaded.`
        );
        setShowAlert(true);
        return false;
      }
      return true;
    });

    setFiles((prevFiles: File[]) => [...prevFiles, ...acceptedFiles]);
    const urls = acceptedFiles.map((file: File) => convertFileToUrl(file));
    onFieldChange([...imageUrls, ...urls]);
  };

  const handleRemoveImage = async (index: number) => {
    const url = new URL(imageUrls[index]);
    const deleteImage = url.pathname.split("/").pop();
    if (deleteImage) {
      await deleteSingleImage({
        deleteImage,
        path: "/profile",
      });
    }
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    onFieldChange(newImageUrls);
  };

  return (
    <div className="flex-center flex p-3 flex-col overflow-hidden rounded-xl bg-gray-200">
      <div className="text-left text-sm w-full mx-auto">
        <div className="font-semibold">Add Photo</div>
        <div>
          <small className="text-[#464b4f]">
            Add at least 2 photos for this category
          </small>
          <br />
          <small className="text-[#464b4f]">
            First picture - is the title picture.
          </small>
        </div>

        {imageUrls.length > 0 ? (
          <div className="flex w-full m-1">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <AddBoxIcon className="my-auto hover:cursor-pointer" />
            </label>

            <div className="grid grid-cols-3 lg:grid-cols-5 w-full p-1">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative mb-1 rounded-sm shadow-sm p-1 bg-white w-20 h-20 lg:w-40 lg:h-40 flex-shrink-0"
                >
                  <Image
                    src={url}
                    alt={`image-${index}`}
                    className="w-full h-full object-cover object-center rounded-sm"
                    width={77}
                    height={77}
                  />
                  <div
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 rounded-xl bg-white p-1 shadow-sm"
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-center flex-col py-5 text-grey-500">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <img
                src="/assets/icons/upload.svg"
                width={77}
                height={77}
                alt="file upload"
              />
              <h3 className="mb-2 mt-2">Tap to upload photos</h3>
            </label>
          </div>
        )}

        <br />
        <small className="text-[#464b4f]">
          Supported formats are .jpg, .gif .svg, and .png, 5MB max
        </small>
      </div>

      {showAlert && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{showMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
