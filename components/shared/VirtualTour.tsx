interface Prop {
  virtualTourLink: string;
}

const VirtualTour = ({virtualTourLink}:Prop) => {
    return (
      <div className="w-full h-full">
      
 <iframe
             src={virtualTourLink}
            width="100%"
            height="500px"
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="3D Virtual Tour"
          ></iframe>
      
      </div>
    );
  };
  
  export default VirtualTour;
  