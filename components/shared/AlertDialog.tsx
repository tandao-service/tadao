import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  
  export function AlertDialogDemo({
    message,
    onChange,
  }: {
    message: string;
    onChange: (field: string, value: string) => void;
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Alert</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
             {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Okay</AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */} 
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  