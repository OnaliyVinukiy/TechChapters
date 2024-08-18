// import React, { useState, useEffect, useRef } from "react";
// import Footer from "../components/Footer.jsx";

// import "./about/abo.css";
// import "./about/about.js";

// import pro2 from "./about/onaliy.jpg";
// import pro3 from "./about/avish.jpg";
// import pro4 from "./about/rash.jpg";
// import pro5 from "./about/geeth.jpg";
// import pro6 from "./about/kalidu.jpg";

// import s1 from "../images/img1.jpg";
// import s2 from "../images/img2.jpg";
// import s3 from "../images/img3.jpg";
// import s4 from "../images/img4.jpg";

// export default function About() {
//   const [currentSlide, setCurrentSlide] = useState(1);
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const nextSlide = (currentSlide % 4) + 1;
//       setCurrentSlide(nextSlide);
//       scrollToSlide(nextSlide);
//     }, 5000); // Change slide every 5 seconds

//     return () => clearInterval(interval);
//   }, [currentSlide]);

//   const scrollToSlide = (slideNumber) => {
//     const slider = sliderRef.current;
//     const slide = document.getElementById(`slide-${slideNumber}`);
//     if (slider && slide) {
//       slider.scrollTo({
//         left: slide.offsetLeft,
//         behavior: "smooth",
//       });
//     }
//   };

//   const handleNavClick = (slideNumber) => {
//     setCurrentSlide(slideNumber);
//     scrollToSlide(slideNumber);
//   };

//   const data = [
//     {
//       name: `Avish Madushanka`,
//       img: pro3,
//       review: `Software Engineering Undergraduate`,
//       icon1:
//         "<i onclick=\"window.open('https://github.com/Avish-Madushanka', '_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
//       icon2:
//         "<i onclick=\"window.open('https://www.instagram.com/avish_madushanka/?igsh=bzJzN2Z0aWt0c3Vx', '_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
//       icon3:
//         '<i onclick="window.open(\'https://www.linkedin.com/in/avish-madushanka-640172248\', \'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
//     },
//     {
//       name: `Onaliy Vinukiy`,
//       img: pro2,
//       review: `Software Engineering Undergraduate`,
//       icon1:
//         "<i onclick=\"window.open('https://github.com/OnaliyVinukiy', '_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
//       icon2:
//         "<i onclick=\"window.open('https://www.instagram.com/__onaliy_vinu__/', '_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
//       icon3:
//         '<i onclick="window.open(\'https://www.linkedin.com/in/onaliy-vinukiy-jayawardana/\', \'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
//     },
//     {
//       name: `Jayamuni Rashminda`,
//       img: pro4,
//       review: `Software Engineering Undergraduate`,
//       icon1:
//         "<i onclick=\"window.open('https://github.com/Rashminda121', '_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
//       icon2:
//         "<i onclick=\"window.open('https://www.instagram.com/rashminda_jc/', '_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
//       icon3:
//         '<i onclick="window.open(\'https://www.linkedin.com/in/chamindu-rashminda-42565828a\', \'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
//     },
//   ];

//   const data2 = [
//     {
//       name: `GEETH INDUWARE`,
//       img: pro5,
//       review: `Software Engineering Undergraduate`,
//       icon1:
//         "<i onclick=\"window.open( 'https://github.com/geethdev','_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
//       icon2:
//         "<i onclick=\"window.open( 'https://www.instagram.com/geeth.induwara/','_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
//       icon3:
//         '<i onclick="window.open( \'https://www.linkedin.com/in/geethinduwara/\',\'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
//     },
//     {
//       name: `KALINDU PERERA`,
//       img: pro6,
//       review: `Software Engineering Undergraduate`,
//       icon1:
//         "<i onclick=\"window.open( 'https://github.com/K-M-PERERA','_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
//       icon2:
//         "<i onclick=\"window.open( 'https://www.instagram.com/kalindu_malika','_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
//       icon3:
//         '<i onclick="window.open( \'\'https://www.linkedin.com/in/kalindu-malika-1746a4295\', \'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
//     },
//   ];

//   return (
//     <div className="bod mb-10">
//       <section
//         className="bg-center bg-no-repeat bg-[url(https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/aboutslider.jpg
// )] bg-gray-700 bg-blend-multiply mt-12"
//       >
//         <div className="px-4 mx-auto max-w-screen-xl md:h-[20rem] sm:h-[15rem] text-center py-12 lg:py-20">
//           <h3 className="mt-8 text-3xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
//             About Us
//           </h3>
//         </div>
//       </section>

//       <div className="nsbm mt-5 flex justify-center items-center"></div>
//       <div className="nsbm  pt-10 mt-3 mb-5 flex justify-center items-center">
//         <div className="nsbm-txt  p-10  ml-20 mr-20">
//           <h1 className="mt-5 mb-3 text-xl nsbm-head">
//             {" "}
//             NSBM GREEN UNIVERSITY
//           </h1>
//           <p className="text-l txt-col2 txt-d text-justify">
//             NSBM Green University, the nation’s premier degree-awarding
//             institute, is the first of its kind in South Asia. It is a
//             government-owned self-financed institute that operates under the
//             purview of the Ministry of Education. As a leading educational
//             centre in the country, NSBM has evolved into becoming a highly
//             responsible higher education institute that offers unique
//             opportunities and holistic education on par with international
//             standards while promoting sustainable living. NSBM offers a plethora
//             of undergraduate and postgraduate degree programmes under five
//             faculties: Business, Computing, Engineering, Science and
//             Postgraduate & Professional Advancement. These study programmes at
//             NSBM are either its own programmes recognised by the University
//             Grants Commission and the Ministry of Higher Education or
//             world-class international programmes conducted in affiliation with
//             top-ranked foreign universities such as University of Plymouth, UK,
//             and Victoria University, Australia. Focused on producing competent
//             professionals and innovative entrepreneurs for the increasingly
//             globalising world, NSBM nurtures its graduates to become productive
//             citizens of society with their specialisation ranging in study
//             fields such as Business, Management, Computing, IT, Engineering,
//             Science, Psychology, Nursing, Interior design, Quantity Surveying,
//             Law and Multimedia. Inspired by the vision of being Sri Lanka’s
//             best-performing graduate school and being recognised
//             internationally, NSBM currently achieves approximately 3000 new
//             enrollments per year and houses above 11,000 students reading over
//             50 degree programmes under 4 faculties. Moreover, over the years,
//             NSBM Green University has gifted the nation with 14,000+ graduates
//             and has proved its global presence with an alumni network spread all
//             across the world. Nestling on a 40-acre land amidst the greenery and
//             serenity in Pitipana, Homagama, NSBM Green University, is an
//             ultra-modern university complex constructed with state-of-the-art
//             facilities and amenities that provides the perfect setting for
//             high-quality teaching, learning and research.
//           </p>
//           <div className="icons mt-5  flex justify-center items-center">
//             <i
//               className="fa-solid fa-globe fa-2x mr-3"
//               onClick={() => window.open("https://www.nsbm.ac.lk/", "_blank")}
//             ></i>
//             <i
//               className="fa-solid fa-location-dot fa-2x mr-3"
//               onClick={() =>
//                 window.open(
//                   "https://maps.app.goo.gl/GSPJD3Uozh4mXSDV8",
//                   "_blank"
//                 )
//               }
//             ></i>
//             <i
//               className="fa-brands fa-linkedin fa-2x mr-3"
//               onClick={() =>
//                 window.open(
//                   "https://www.linkedin.com/school/nsbmgreenuniversity",
//                   "_blank"
//                 )
//               }
//             ></i>
//             <i
//               className="fa-brands fa-facebook fa-2x "
//               onClick={() =>
//                 window.open("https://web.facebook.com/nsbm.lk", "_blank")
//               }
//             ></i>
//           </div>
//         </div>
//       </div>
//       <div className="nsbm pt-10 mt-3 mb-5 flex justify-center items-center w-full">
//         <iframe
//           className="w-3/4 shadow-xl"
//           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5757963152946!2d80.03899797448226!3d6.821334419631726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2523b05555555%3A0x546c34cd99f6f488!2sNSBM%20Green%20University!5e0!3m2!1sen!2slk!4v1710687260967!5m2!1sen!2slk"
//           width="600"
//           height="450"
//           style={{ border: 0 }}
//           allowFullScreen=""
//           loading="lazy"
//           referrerPolicy="no-referrer-when-downgrade"
//         ></iframe>
//       </div>

//       <section className="container">
//         <div className="slider-wrapper">
//           <div className="slider" ref={sliderRef}>
//             <img
//               id="slide-1"
//               src={s1}
//               alt="NSBM front gate"
//               style={{ display: currentSlide === 1 ? "block" : "none" }}
//             />
//             <img
//               id="slide-2"
//               src={s2}
//               alt="nsbm front"
//               style={{ display: currentSlide === 2 ? "block" : "none" }}
//             />
//             <img
//               id="slide-3"
//               src={s3}
//               alt="nsbm swimming pool"
//               style={{ display: currentSlide === 3 ? "block" : "none" }}
//             />
//             <img
//               id="slide-4"
//               src={s4}
//               alt="nsbm ground 1"
//               style={{ display: currentSlide === 4 ? "block" : "none" }}
//             />
//           </div>
//           <div className="slider-nav">
//             <a href="#slide-1" onClick={() => handleNavClick(1)}></a>
//             <a href="#slide-2" onClick={() => handleNavClick(2)}></a>
//             <a href="#slide-3" onClick={() => handleNavClick(3)}></a>
//             <a href="#slide-4" onClick={() => handleNavClick(4)}></a>
//           </div>
//         </div>
//       </section>

//       <div className="nsbm mt-10 mb-5 flex justify-center items-center">
//         <h1 className="text-3xl txt-col">Our Team</h1>
//       </div>

//       <div className="mainContainer ">
//         {data.map((d) => (
//           <div className="box" key={d.name}>
//             <div className="card">
//               <div className="image flex justify-center items-center">
//                 <img src={d.img} alt="" className="rounded-full " />
//               </div>
//               <div className="desc">
//                 <h1 className="text-xl font-semibold">{d.name}</h1>
//                 <p>{d.review}</p>
//                 <br></br>
//                 <div
//                   className="px-6 g-4"
//                   dangerouslySetInnerHTML={{
//                     __html: `${d.icon1} ${d.icon2} ${d.icon3}`,
//                   }}
//                 />
//               </div>
//             </div>
//             <br></br>
//           </div>
//         ))}
//       </div>
//       <div className="mContainer">
//         {data2.map((d) => (
//           <div className="box2" key={d.name}>
//             <div className="card2">
//               <div className="image2 flex justify-center items-center">
//                 <img src={d.img} alt="" className="rounded-full " />
//               </div>
//               <div className="2desc">
//                 <h1 className="text-xl font-semibold icons">{d.name}</h1>
//                 <br></br>
//                 <p>{d.review}</p>
//                 <br></br>
//                 <div
//                   className="px-6 g-4"
//                   dangerouslySetInnerHTML={{
//                     __html: `${d.icon1} ${d.icon2} ${d.icon3}`,
//                   }}
//                 />
//               </div>
//             </div>
//             <br></br>
//           </div>
//         ))}
//       </div>
//       <div className="mt-20 mb-10">
//         <h1 hidden></h1>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer.jsx";

import "./about/abo.css";
import "./about/about.js";

import pro2 from "./about/onaliy.jpg";
import pro3 from "./about/avish.jpg";
import pro4 from "./about/rash.jpg";
import pro5 from "./about/geeth.jpg";
import pro6 from "./about/kalidu.jpg";

import s1 from "../images/sample/1.jpg";
import s2 from "../images/sample/2.jpg";
import s3 from "../images/sample/3.jpg";

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide % 4) + 1;
      setCurrentSlide(nextSlide);
      scrollToSlide(nextSlide);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  const scrollToSlide = (slideNumber) => {
    const slider = sliderRef.current;
    const slide = document.getElementById(`slide-${slideNumber}`);
    if (slider && slide) {
      slider.scrollTo({
        left: slide.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  const handleNavClick = (slideNumber) => {
    setCurrentSlide(slideNumber);
    scrollToSlide(slideNumber);
  };

  const data = [
    
    {
      name: `Onaliy Vinukiy`,
      img: pro2,
      review: `Software Engineer Intern at WSO2 Software Engineering Undergraduate`,
      icon1:
        "<i onclick=\"window.open('https://github.com/OnaliyVinukiy', '_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
      icon2:
        "<i onclick=\"window.open('https://www.instagram.com/__onaliy_vinu__/', '_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
      icon3:
        '<i onclick="window.open(\'https://www.linkedin.com/in/onaliy-vinukiy-jayawardana/\', \'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
    },
    {
      name: `Jayamuni Rashminda`,
      img: pro4,
      review: `Software Engineer Intern at Fortude Software Engineering Undergraduate`,
      icon1:
        "<i onclick=\"window.open('https://github.com/Rashminda121', '_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
      icon2:
        "<i onclick=\"window.open('https://www.instagram.com/rashminda_jc/', '_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
      icon3:
        '<i onclick="window.open(\'https://www.linkedin.com/in/chamindu-rashminda-42565828a\', \'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
    },
  ];

  // const data2 = [
  //   {
  //     name: `GEETH INDUWARE`,
  //     img: pro5,
  //     review: `Software Engineering Undergraduate`,
  //     icon1:
  //       "<i onclick=\"window.open( 'https://github.com/geethdev','_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
  //     icon2:
  //       "<i onclick=\"window.open( 'https://www.instagram.com/geeth.induwara/','_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
  //     icon3:
  //       '<i onclick="window.open( \'https://www.linkedin.com/in/geethinduwara/\',\'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
  //   },
  //   {
  //     name: `KALINDU PERERA`,
  //     img: pro6,
  //     review: `Software Engineering Undergraduate`,
  //     icon1:
  //       "<i onclick=\"window.open( 'https://github.com/K-M-PERERA','_blank')\" class=\"fa-brands fa-github fa-2x colour\"></i>",
  //     icon2:
  //       "<i onclick=\"window.open( 'https://www.instagram.com/kalindu_malika','_blank')\" class=\"fa-brands fa-instagram fa-2x colour\"></i>",
  //     icon3:
  //       '<i onclick="window.open( \'\'https://www.linkedin.com/in/kalindu-malika-1746a4295\', \'_blank\')" class="fa-brands fa-linkedin fa-2x colour"><a href="" ></i>',
  //   },
  // ];

  return (
    <div className="bod mb-10">
      <section
        className="bg-center bg-no-repeat bg-[url(https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/aboutslider.jpg
)] bg-gray-700 bg-blend-multiply mt-12"
      >
        <div className="px-4 mx-auto max-w-screen-xl md:h-[20rem] sm:h-[15rem] text-center py-12 lg:py-20">
          <h3 className="mt-8 text-3xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            About Us
          </h3>
        </div>
      </section>

      <div className="nsbm mt-5 flex justify-center items-center"></div>
      <div className="nsbm  pt-10 mt-3 mb-5 flex justify-center items-center">
        <div className="nsbm-txt  p-10  ml-20 mr-20">
          <h1 className="mt-5 mb-10 text-4xl nsbm-head text-center">
            {" "}
            Tech Chapters
          </h1>
          <p className="text-l txt-col2 txt-d text-justify">
            We are passionate about bridging the gap between students, tech
            enthusiasts, and impactful volunteer opportunities. Our platform is
            dedicated to showcasing events across the country that allow
            individuals to contribute their skills, learn, and grow within a
            supportive community. We believe in the power of collaboration and
            the positive change it can bring, both to the volunteers and the
            communities they serve. By connecting like-minded individuals with
            events that matter, we aim to inspire a new generation of leaders
            and innovators who are committed to making a difference. Our mission
            goes beyond just listing events—we're focused on building a vibrant
            network of volunteers who can share knowledge, exchange ideas, and
            work together to tackle challenges. Whether you're a student looking
            to gain hands-on experience or a tech enthusiast eager to contribute
            to meaningful causes, our platform is designed to make it easier
            than ever to find the perfect volunteer opportunity. Join us in
            creating a community where passion meets purpose, and where every
            event is a step towards a brighter, more connected future.
          </p>
          <div className="icons mt-5  flex justify-center items-center">
            <i
              className="fa-solid fa-globe fa-2x mr-3"
              onClick={() => window.open("https://www.nsbm.ac.lk/", "_blank")}
            ></i>
            <i
              className="fa-solid fa-location-dot fa-2x mr-3"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/GSPJD3Uozh4mXSDV8",
                  "_blank"
                )
              }
            ></i>
            <i
              className="fa-brands fa-linkedin fa-2x mr-3"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/school/nsbmgreenuniversity",
                  "_blank"
                )
              }
            ></i>
            <i
              className="fa-brands fa-facebook fa-2x "
              onClick={() =>
                window.open("https://web.facebook.com/nsbm.lk", "_blank")
              }
            ></i>
          </div>
        </div>
      </div>
      <div className="nsbm pt-10 mt-3 mb-5 flex justify-center items-center w-full">
        <iframe
          className="w-3/4 shadow-xl"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4011843.434685106!2d79.69543264867355!3d7.873054600718873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2e3b3b3b3b3b3%3A0x0000000000000000!2sSri%20Lanka!5e0!3m2!1sen!2slk!4v1710687260967!5m2!1sen!2slk"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <section className="container">
        <div className="slider-wrapper">
          <div className="slider" ref={sliderRef}>
            <img
              id="slide-1"
              src={s1}
              alt="NSBM front gate"
              style={{ display: currentSlide === 1 ? "block" : "none" }}
            />
            <img
              id="slide-2"
              src={s2}
              alt="nsbm front"
              style={{ display: currentSlide === 2 ? "block" : "none" }}
            />
            <img
              id="slide-3"
              src={s3}
              alt="nsbm swimming pool"
              style={{ display: currentSlide === 3 ? "block" : "none" }}
            />
          </div>
          <div className="slider-nav">
            <a href="#slide-1" onClick={() => handleNavClick(1)}></a>
            <a href="#slide-2" onClick={() => handleNavClick(2)}></a>
            <a href="#slide-3" onClick={() => handleNavClick(3)}></a>
          </div>
        </div>
      </section>

      <div className="nsbm mt-10 mb-5 flex justify-center items-center">
        <h1 className="text-3xl txt-col">Our Team</h1>
      </div>

      <div className="mainContainer ml-48">
        {data.map((d) => (
          <div className="box" key={d.name}>
            <div className="card">
              <div className="image flex justify-center items-center">
                <img src={d.img} alt="" className="rounded-full " />
              </div>
              <div className="desc">
                <h1 className="text-xl font-semibold">{d.name}</h1>
                <p>{d.review}</p>
                <br></br>
                <div
                  className="px-6 g-4"
                  dangerouslySetInnerHTML={{
                    __html: `${d.icon1} ${d.icon2} ${d.icon3}`,
                  }}
                />
              </div>
            </div>
            <br></br>
          </div>
        ))}
      </div>
      {/* <div className="mContainer">
        {data2.map((d) => (
          <div className="box2" key={d.name}>
            <div className="card2">
              <div className="image2 flex justify-center items-center">
                <img src={d.img} alt="" className="rounded-full " />
              </div>
              <div className="2desc">
                <h1 className="text-xl font-semibold icons">{d.name}</h1>
                <br></br>
                <p>{d.review}</p>
                <br></br>
                <div
                  className="px-6 g-4"
                  dangerouslySetInnerHTML={{
                    __html: `${d.icon1} ${d.icon2} ${d.icon3}`,
                  }}
                />
              </div>
            </div>
            <br></br>
          </div>
        ))}
      </div> */}
      <div className="mt-20 mb-10">
        <h1 hidden></h1>
      </div>
    </div>
  );
}

