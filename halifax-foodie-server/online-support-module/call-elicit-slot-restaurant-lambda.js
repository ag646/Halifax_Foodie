exports.handler = async (event) =>{
    let {name, slots} = event.currentIntent
    
    console.log(event);
    
    if(!slots.RestaurantOne &&
        slots.RestuarantName && slots.RestuarantName.toLowerCase() === "restaurant 1"){
        return {
            dialogAction:{
                type:"ElicitSlot",
                intentName:name,
                slotToElicit: "RestaurantOne",
                slots
            }
        }
    }
    else if (!slots.RestaurantTwo &&
        slots.RestuarantName && slots.RestuarantName.toLowerCase() === "restaurant 2"){
         return {
            dialogAction:{
                type:"ElicitSlot",
                intentName:name,
                slotToElicit: "RestaurantTwo",
                slots
            }
        }
    }
    else if (!slots.RestuarantThree &&
        slots.RestuarantName && slots.RestuarantName.toLowerCase() === "restaurant 3"){
         return {
            dialogAction:{
                type:"ElicitSlot",
                intentName:name,
                slotToElicit: "RestuarantThree",
                slots
            }
        }
    }
    return{
        dialogAction:{
            type:"Delegate",
        slots
        }
    }
}