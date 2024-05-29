import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const AddRoom = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const {user} = useAuth();
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState('Upload Image')


   const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }
);

    // date Range Handler
    const handleDates = item =>{
        console.log(item);
        setDates(item.selection)
    }

    // tanstack query mutation
    const {mutateAsync} = useMutation({
     mutationFn: async (roomData) => {
      const {data} = await axiosSecure.post(`/room`, roomData)
      return data;
     },
     onSuccess: () => {
      console.log("Data Save Successfully");
     toast.success('Room Added Successfuly')
     navigate('/dashboard/my-listings')
      setLoading(false);
     }
    })




    // form handler
    const handleSubmit = async e => {
      e.preventDefault();
      setLoading(true);
      const form = e.target;
      const location = form.location.value;
      const category = form.category.value;
      const title = form.title.value;
      const to = dates.endDate;
      const from = dates.startDate;
      const price = form.price.value;
      const guests = form.guests.value;
      const bathrooms = form.bathrooms.value;
      const description = form.description.value;
      const bedrooms = form.bedrooms.value;
      const image = form.image.files[0];
      const host = {
        name: user?.displayName,
        image: user?.photoURL,
        email: user?.email,
      }
     try{
      const image_url = await imageUpload(image)
     
    const roomData = {
      location, title, category, to, from, price,  bathrooms, description, bedrooms, image: image_url, host, guests,
    }
    console.table(roomData);

    // Post Request to server
    await mutateAsync(roomData);
    }catch(err){
      console.log(err);
      toast.error(err.message)
      setLoading(false);
     }
      
    }


    // handle image change
    const handleImage = image => {
      setImagePreview(URL.createObjectURL(image))
      setImageText(image.name)
    }


    return (
     <>
     <Helmet>
      <title>Add room | Dashboard</title>
     </Helmet>

      {/* form */}
      <AddRoomForm dates={dates} handleDates={handleDates} handleSubmit={handleSubmit}
      setImagePreview={setImagePreview}
     imagePreview={imagePreview} 
     handleImage={handleImage}
     imageText={imageText}
     loading={loading}
     />
      </>
    );
};

export default AddRoom;