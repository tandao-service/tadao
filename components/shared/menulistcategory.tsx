import { DeleteCategory } from "./DeleteCategory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Image from "next/image";
import Link from "next/link";
type MobileProps = {
  categoryList: any;
};
export default function Menulistcategory({ categoryList }: MobileProps) {
  return (
    <div className="container mx-auto mt-0 bg-grey-50 p-2 rounded-sm">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols- m-1 gap-1">
        {categoryList.length > 0 &&
          categoryList.map((category: any) => (
            <div
              key={category._id}
              className="bg-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-0 border-emerald-300 hover:bg-emerald-100 "
            >
              <div className="flex flex-col items-center justify-center">
                <a href={"/" + category.name}>
                  <Image
                    className="w-16 h-16 rounded-full"
                    src={category.imageUrl}
                    alt="Menu Image"
                    width={200}
                    height={200}
                  />
                </a>

                <h2 className="text-xs">{category.name}</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <p className="p-1 cursor-pointer text-xs rounded-lg w-full">
                      View subcategories?
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-gray-800 p-1">
                      <ul className="flex flex-col gap-2 py-0">
                        {category.subcategory.map(
                          (subcategory: any, index: number) => (
                            <li key={index} className="flex items-center gap-4">
                              <div className="flex gap-2">
                                <CheckCircleIcon sx={{ fontSize: 14 }} />
                                {subcategory.title}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex items-center">
                <Link
                  href={`/categories/${category._id}/update`}
                  className="mr-2"
                >
                  <Image
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                </Link>
                <DeleteCategory
                  categoryId={category._id}
                  categoryImage={category.imageUrl}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
