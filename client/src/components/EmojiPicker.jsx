import { useEffect,useState } from "react";

const MyEmojiPicker=({func,val})=>{
    const emojis = [
        [
          { em: "😀", des: "Grinning Face" },
          { em: "😃", des: "Grinning Face with Big Eyes" },
          { em: "😄", des: "Grinning Face with Smiling Eyes" },
          { em: "😁", des: "Beaming Face with Smiling Eyes" },
          { em: "😆", des: "Grinning Squinting Face" },
          { em: "😅", des: "Grinning Face with Sweat" },
          { em: "😂", des: "Face with Tears of Joy" },
          { em: "🤣", des: "Rolling on the Floor Laughing" },
          { em: "😊", des: "Smiling Face with Smiling Eyes" }
        ],
        [
          { em: "😇", des: "Smiling Face with Halo" },
          { em: "🙂", des: "Slightly Smiling Face" },
          { em: "🙃", des: "Upside-Down Face" },
          { em: "😉", des: "Winking Face" },
          { em: "😌", des: "Relieved Face" },
          { em: "😍", des: "Smiling Face with Heart-Eyes" },
          { em: "🥰", des: "Smiling Face with Hearts" },
          { em: "😘", des: "Face Blowing a Kiss" },
          { em: "😗", des: "Kissing Face" }
        ],
        [
          { em: "😙", des: "Kissing Face with Smiling Eyes" },
          { em: "😚", des: "Kissing Face with Closed Eyes" },
          { em: "😋", des: "Face Savoring Food" },
          { em: "😛", des: "Face with Tongue" },
          { em: "😜", des: "Winking Face with Tongue" },
          { em: "🤪", des: "Zany Face" },
          { em: "😝", des: "Squinting Face with Tongue" },
          { em: "🤑", des: "Money-Mouth Face" },
          { em: "🤗", des: "Hugging Face" }
        ],
        [
          { em: "🤔", des: "Thinking Face" },
          { em: "🤨", des: "Face with Raised Eyebrow" },
          { em: "😐", des: "Neutral Face" },
          { em: "😑", des: "Expressionless Face" },
          { em: "😶", des: "Face Without Mouth" },
          { em: "🙄", des: "Face with Rolling Eyes" },
          { em: "😏", des: "Smirking Face" },
          { em: "😒", des: "Unamused Face" },
          { em: "😞", des: "Disappointed Face" }
        ],
        [
          { em: "😔", des: "Pensive Face" },
          { em: "😟", des: "Worried Face" },
          { em: "😕", des: "Confused Face" },
          { em: "🙁", des: "Slightly Frowning Face" },
          { em: "☹️", des: "Frowning Face" },
          { em: "😣", des: "Persevering Face" },
          { em: "😖", des: "Confounded Face" },
          { em: "😫", des: "Tired Face" },
          { em: "😩", des: "Weary Face" }
        ],
        [
          { em: "🥺", des: "Pleading Face" },
          { em: "😢", des: "Crying Face" },
          { em: "😭", des: "Loudly Crying Face" },
          { em: "😤", des: "Face with Steam from Nose" },
          { em: "😠", des: "Angry Face" },
          { em: "😡", des: "Pouting Face" },
          { em: "🤬", des: "Face with Symbols on Mouth" },
          { em: "🤯", des: "Exploding Head" },
          { em: "😳", des: "Flushed Face" }
        ],
        [
          { em: "🥵", des: "Hot Face" },
          { em: "🥶", des: "Cold Face" },
          { em: "😱", des: "Face Screaming in Fear" },
          { em: "😨", des: "Fearful Face" },
          { em: "😰", des: "Anxious Face with Sweat" },
          { em: "😥", des: "Sad but Relieved Face" },
          { em: "😓", des: "Downcast Face with Sweat" },
          { em: "🤔", des: "Thinking Face" },
          { em: "🤗", des: "Hugging Face" }
        ],
        [
          { em: "🤤", des: "Drooling Face" },
          { em: "😪", des: "Sleepy Face" },
          { em: "😴", des: "Sleeping Face" },
          { em: "🤕", des: "Face with Head-Bandage" },
          { em: "🤒", des: "Face with Thermometer" },
          { em: "🤧", des: "Sneezing Face" },
          { em: "🥳", des: "Partying Face" },
          { em: "🥴", des: "Woozy Face" },
          { em: "😵", des: "Dizzy Face" }
        ],
        [
          { em: "🤠", des: "Cowboy Hat Face" },
          { em: "😎", des: "Smiling Face with Sunglasses" },
          { em: "🤓", des: "Nerd Face" },
          { em: "🧐", des: "Face with Monocle" },
          { em: "😕", des: "Confused Face" },
          { em: "😲", des: "Astonished Face" },
          { em: "🤥", des: "Lying Face" },
          { em: "🤫", des: "Shushing Face" },
          { em: "🤭", des: "Face with Hand Over Mouth" }
        ]
     ,
        [
          { em: "🤑", des: "Money-Mouth Face" },
          { em: "🤐", des: "Zipped Mouth Face" },
          { em: "🤨", des: "Face with Raised Eyebrow" },
          { em: "😐", des: "Neutral Face" },
          { em: "😑", des: "Expressionless Face" },
          { em: "😶", des: "Face Without Mouth" },
          { em: "😶‍🌫️", des: "Face in Clouds" },
          { em: "😏", des: "Smirking Face" },
          { em: "😒", des: "Unamused Face" }
        ],
        [
          { em: "🙄", des: "Face with Rolling Eyes" },
          { em: "😬", des: "Grimacing Face" },
          { em: "😮‍💨", des: "Face Exhaling" },
          { em: "🤥", des: "Lying Face" },
          { em: "😌", des: "Relieved Face" },
          { em: "😔", des: "Pensive Face" },
          { em: "😪", des: "Sleepy Face" },
          { em: "🤤", des: "Drooling Face" },
          { em: "😴", des: "Sleeping Face" }
        ],
        [
          { em: "😷", des: "Face with Medical Mask" },
          { em: "🤒", des: "Face with Thermometer" },
          { em: "🤕", des: "Face with Head-Bandage" },
          { em: "🤢", des: "Nauseated Face" },
          { em: "🤮", des: "Face Vomiting" },
          { em: "🤧", des: "Sneezing Face" },
          { em: "🥵", des: "Hot Face" },
          { em: "🥶", des: "Cold Face" },
          { em: "🥴", des: "Woozy Face" }
        ],
        [
          { em: "😵", des: "Dizzy Face" },
          { em: "😵‍💫", des: "Face with Spiral Eyes" },
          { em: "🤯", des: "Exploding Head" },
          { em: "🤠", des: "Cowboy Hat Face" },
          { em: "😎", des: "Smiling Face with Sunglasses" },
          { em: "🤓", des: "Nerd Face" },
          { em: "🧐", des: "Face with Monocle" },
          { em: "😕", des: "Confused Face" },
          { em: "😟", des: "Worried Face" }
        ],
        [
          { em: "🙁", des: "Slightly Frowning Face" },
          { em: "☹️", des: "Frowning Face" },
          { em: "😮", des: "Face with Open Mouth" },
          { em: "😯", des: "Hushed Face" },
          { em: "😲", des: "Astonished Face" },
          { em: "😳", des: "Flushed Face" },
          { em: "🥺", des: "Pleading Face" },
          { em: "😦", des: "Frowning Face with Open Mouth" },
          { em: "😧", des: "Anguished Face" }
        ],
        [
          { em: "😨", des: "Fearful Face" },
          { em: "😰", des: "Anxious Face with Sweat" },
          { em: "😥", des: "Sad but Relieved Face" },
          { em: "😢", des: "Crying Face" },
          { em: "😭", des: "Loudly Crying Face" },
          { em: "😱", des: "Face Screaming in Fear" },
          { em: "😖", des: "Confounded Face" },
          { em: "😣", des: "Persevering Face" },
          { em: "😞", des: "Disappointed Face" }
        ],
        [
          { em: "😓", des: "Downcast Face with Sweat" },
          { em: "😩", des: "Weary Face" },
          { em: "😫", des: "Tired Face" },
          { em: "🥱", des: "Yawning Face" },
          { em: "😤", des: "Face with Steam from Nose" },
          { em: "😡", des: "Pouting Face" },
          { em: "😠", des: "Angry Face" },
          { em: "🤬", des: "Face with Symbols on Mouth" },
          { em: "😈", des: "Smiling Face with Horns" }
        ],
        [
          { em: "👿", des: "Angry Face with Horns" },
          { em: "💀", des: "Skull" },
          { em: "☠️", des: "Skull and Crossbones" },
          { em: "👻", des: "Ghost" },
          { em: "👽", des: "Alien" },
          { em: "👾", des: "Alien Monster" },
          { em: "🤖", des: "Robot" },
          { em: "🎃", des: "Jack-O-Lantern" },
          { em: "😺", des: "Grinning Cat" }
        ],
        [
          { em: "😸", des: "Grinning Cat with Smiling Eyes" },
          { em: "😹", des: "Cat with Tears of Joy" },
          { em: "😻", des: "Smiling Cat with Heart-Eyes" },
          { em: "😼", des: "Cat with Wry Smile" },
          { em: "😽", des: "Kissing Cat" },
          { em: "🙀", des: "Weary Cat" },
          { em: "😿", des: "Crying Cat" },
          { em: "😾", des: "Pouting Cat" },
          { em: "💋", des: "Kiss Mark" }
        ],
        [
          { em: "👋", des: "Waving Hand" },
          { em: "🤚", des: "Raised Back of Hand" },
          { em: "🖐️", des: "Hand with Fingers Splayed" },
          { em: "✋", des: "Raised Hand" },
          { em: "🖖", des: "Vulcan Salute" },
          { em: "👌", des: "OK Hand" },
          { em: "🤏", des: "Pinching Hand" },
          { em: "✌️", des: "Victory Hand" },
          { em: "🤞", des: "Crossed Fingers" }
        ],
        [
          { em: "🤟", des: "Love-You Gesture" },
          { em: "🤘", des: "Sign of the Horns" },
          { em: "🤙", des: "Call Me Hand" },
          { em: "👈", des: "Backhand Index Pointing Left" },
          { em: "👉", des: "Backhand Index Pointing Right" },
          { em: "👆", des: "Backhand Index Pointing Up" },
          { em: "🖕", des: "Middle Finger" },
          { em: "👇", des: "Backhand Index Pointing Down" },
          { em: "☝️", des: "Index Pointing Up" }
        ],
        [
          { em: "👍", des: "Thumbs Up" },
          { em: "👎", des: "Thumbs Down" },
          { em: "✊", des: "Raised Fist" },
          { em: "👊", des: "Oncoming Fist" },
          { em: "🤛", des: "Left-Facing Fist" },
          { em: "🤜", des: "Right-Facing Fist" },
          { em: "👏", des: "Clapping Hands" },
          { em: "🙌", des: "Raising Hands" },
          { em: "👐", des: "Open Hands" }
        ],
        [
          { em: "🤲", des: "Palms Up Together" },
          { em: "🤝", des: "Handshake" },
          { em: "🙏", des: "Folded Hands" },
          { em: "✍️", des: "Writing Hand" },
          { em: "💅", des: "Nail Polish" },
          { em: "🤳", des: "Selfie" },
          { em: "💪", des: "Flexed Biceps" },
          { em: "🦾", des: "Mechanical Arm" },
          { em: "🦿", des: "Mechanical Leg" }
        ],
        [
          { em: "🦵", des: "Leg" },
          { em: "🦶", des: "Foot" },
          { em: "👂", des: "Ear" },
          { em: "👃", des: "Nose" },
          { em: "🧠", des: "Brain" },
          { em: "🫀", des: "Anatomical Heart" },
          { em: "🫁", des: "Lungs" },
          { em: "🦷", des: "Tooth" },
          { em: "🦴", des: "Bone" }
        ],
        [
          { em: "👀", des: "Eyes" },
          { em: "👁️", des: "Eye" },
          { em: "👅", des: "Tongue" },
          { em: "👄", des: "Mouth" },
          { em: "🫦", des: "Biting Lip" },
          { em: "💋", des: "Kiss Mark" },
          { em: "🩸", des: "Drop of Blood" },
          { em: "💧", des: "Droplet" },
          { em: "🩹", des: "Adhesive Bandage" }
        ],
        [
          { em: "❤️", des: "Red Heart" },
          { em: "🧡", des: "Orange Heart" },
          { em: "💛", des: "Yellow Heart" },
          { em: "💚", des: "Green Heart" },
          { em: "💙", des: "Blue Heart" },
          { em: "💜", des: "Purple Heart" },
          { em: "🤎", des: "Brown Heart" },
          { em: "🖤", des: "Black Heart" },
          { em: "🤍", des: "White Heart" }
        ],
        [
          { em: "💔", des: "Broken Heart" },
          { em: "❣️", des: "Heart Exclamation" },
          { em: "💕", des: "Two Hearts" },
          { em: "💞", des: "Revolving Hearts" },
          { em: "💓", des: "Beating Heart" },
          { em: "💗", des: "Growing Heart" },
          { em: "💖", des: "Sparkling Heart" },
          { em: "💘", des: "Heart with Arrow" },
          { em: "💝", des: "Heart with Ribbon" }
        ],
        [
          { em: "💟", des: "Heart Decoration" },
          { em: "🖤", des: "Black Heart" },
          { em: "❣️", des: "Heart Exclamation" },
          { em: "💢", des: "Anger Symbol" },
          { em: "💥", des: "Collision" },
          { em: "💦", des: "Sweat Droplets" },
          { em: "💨", des: "Dashing Away" },
          { em: "🕳️", des: "Hole" },
          { em: "💬", des: "Speech Balloon" }
        ],
        [
          { em: "👋", des: "Waving Hand" },
          { em: "🤚", des: "Raised Back of Hand" },
          { em: "🖐️", des: "Hand with Fingers Splayed" },
          { em: "✋", des: "Raised Hand" },
          { em: "🖖", des: "Vulcan Salute" },
          { em: "👌", des: "OK Hand" },
          { em: "🤏", des: "Pinching Hand" },
          { em: "✌️", des: "Victory Hand" },
          { em: "🤞", des: "Crossed Fingers" }
        ],
        [
          { em: "🤟", des: "Love-You Gesture" },
          { em: "🤘", des: "Sign of the Horns" },
          { em: "🤙", des: "Call Me Hand" },
          { em: "👈", des: "Backhand Index Pointing Left" },
          { em: "👉", des: "Backhand Index Pointing Right" },
          { em: "👆", des: "Backhand Index Pointing Up" },
          { em: "🖕", des: "Middle Finger" },
          { em: "👇", des: "Backhand Index Pointing Down" },
          { em: "☝️", des: "Index Pointing Up" }
        ],
        [
          { em: "👍", des: "Thumbs Up" },
          { em: "👎", des: "Thumbs Down" },
          { em: "✊", des: "Raised Fist" },
          { em: "👊", des: "Oncoming Fist" },
          { em: "🤛", des: "Left-Facing Fist" },
          { em: "🤜", des: "Right-Facing Fist" },
          { em: "👏", des: "Clapping Hands" },
          { em: "🙌", des: "Raising Hands" },
          { em: "👐", des: "Open Hands" }
        ],
        [
          { em: "🤲", des: "Palms Up Together" },
          { em: "🤝", des: "Handshake" },
          { em: "🙏", des: "Folded Hands" },
          { em: "✍️", des: "Writing Hand" },
          { em: "💅", des: "Nail Polish" },
          { em: "🤳", des: "Selfie" },
          { em: "💪", des: "Flexed Biceps" },
          { em: "🦾", des: "Mechanical Arm" },
          { em: "🦿", des: "Mechanical Leg" }
        ],
        [
          { em: "🦵", des: "Leg" },
          { em: "🦶", des: "Foot" },
          { em: "👂", des: "Ear" },
          { em: "👃", des: "Nose" },
          { em: "🧠", des: "Brain" },
          { em: "🫀", des: "Anatomical Heart" },
          { em: "🫁", des: "Lungs" },
          { em: "🦷", des: "Tooth" },
          { em: "🦴", des: "Bone" }
        ],
        [
          { em: "👀", des: "Eyes" },
          { em: "👁️", des: "Eye" },
          { em: "👅", des: "Tongue" },
          { em: "👄", des: "Mouth" },
          { em: "🫦", des: "Biting Lip" },
          { em: "💋", des: "Kiss Mark" },
          { em: "🩸", des: "Drop of Blood" },
          { em: "💧", des: "Droplet" },
          { em: "🩹", des: "Adhesive Bandage" }
        ],
        [
          { em: "❤️", des: "Red Heart" },
          { em: "🧡", des: "Orange Heart" },
          { em: "💛", des: "Yellow Heart" },
          { em: "💚", des: "Green Heart" },
          { em: "💙", des: "Blue Heart" },
          { em: "💜", des: "Purple Heart" },
          { em: "🤎", des: "Brown Heart" },
          { em: "🖤", des: "Black Heart" },
          { em: "🤍", des: "White Heart" }
        ],
        [
          { em: "💔", des: "Broken Heart" },
          { em: "❣️", des: "Heart Exclamation" },
          { em: "💕", des: "Two Hearts" },
          { em: "💞", des: "Revolving Hearts" },
          { em: "💓", des: "Beating Heart" },
          { em: "💗", des: "Growing Heart" },
          { em: "💖", des: "Sparkling Heart" },
          { em: "💘", des: "Heart with Arrow" },
          { em: "💝", des: "Heart with Ribbon" }
        ],
        [
          { em: "💟", des: "Heart Decoration" },
          { em: "🖤", des: "Black Heart" },
          { em: "❣️", des: "Heart Exclamation" },
          { em: "💢", des: "Anger Symbol" },
          { em: "💥", des: "Collision" },
          { em: "💦", des: "Sweat Droplets" },
          { em: "💨", des: "Dashing Away" },
          { em: "🕳️", des: "Hole" },
          { em: "💬", des: "Speech Balloon" }
        ]
      ];
      
      
    return(
        <div className=" select-none sm:w-80 overflow-scroll  flex flex-col absolute bottom-[100%] bg-sender h-96  w-[350px] mb-2  right-2 p-3 ">
          <div className="pb-2 font-bold text-slate-300 ">
            Pick Your Emotions
          </div>
            <div className=" overflow-scroll flex flex-col relative ">
            {
                emojis.map((el,ind)=>{
                    return(<EmojiRow row={el} key={ind} func={func} val={val} />)
                })
            }
            </div>
        </div>
    )
};

const EmojiRow=({row,func,val})=>{
  const handleCLick=(e)=>{
    console.log(e.target.innerText);
    func(val+e.target.innerText);
  }
    return(
        <div className="h-12 flex justify-evenly text-[28px] sm:text-[26px] w-full mb-2  ">
            {
                row.map((el,ind)=>{
                    return (
                        <div className="hover:cursor-pointer hover:bg-white/20 active:scale-90 h-9 w-8  flex justify-center items-center rounded-xl">
                            <h2 onClick={handleCLick} className=" p-0 m-0">{el.em}</h2>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default MyEmojiPicker;