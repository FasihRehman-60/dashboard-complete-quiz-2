import React from "react";
import { Github, Linkedin } from "lucide-react";
import profilePic from "../assets/fasih.jpg";

function About() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20 bg-gradient-to-b from-white to-amber-50 text-gray-800">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-white/80 backdrop-blur-lg p-6 sm:p-10 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition">
        <div className="flex-shrink-0">
          <img src={profilePic} alt="Fasih Ur Rehman"
            className="w-40 h-40 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-md border-4 border-amber-400 hover:scale-105 transition-transform duration-300"/>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3">Fasih Ur Rehman </h1>

          <h2 className="text-lg sm:text-xl text-amber-500 font-semibold mb-4"> Frontend Developer & WordPress Developer</h2>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">Hi! I’m a passionate web developer focused on creating elegant and
            user-friendly digital experiences. Skilled in{" "}
            <span className="font-semibold text-gray-800">C++, JavaScript, React, HTML, CSS & Tailwind CSS</span>, I build clean, responsive, and modern web interfaces.
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            <a href="https://github.com/Fasih60" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition shadow-sm hover:shadow-md">
              <Github className="w-5 h-5 text-gray-700" />
            </a>

            <a href="https://www.linkedin.com/in/fasih-rehman60/" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition shadow-sm hover:shadow-md">
              <Linkedin className="w-5 h-5 text-gray-700" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Tech Skills</h2>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">{["C++", "JavaScript", "React", "HTML", "CSS", "Tailwind CSS"].map(
            (skill, i) => (
              <span key={i}
                className="px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 font-medium rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
                {skill}
              </span>
            )
          )}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Services</h2>
        <p className="text-gray-600 mb-10 max-w-3xl mx-auto text-sm sm:text-base px-2">
          I provide modern web development services — from sleek frontends to
          complete backend-powered web applications.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{
              title: "WordPress Websites",
              desc: "Custom, fast, and responsive WordPress designs.",
            },{
              title: "MERN Stack Development",
              desc: "Full web apps using MongoDB, Express, React & Node.",
            },{
              title: "Frontend Development",
              desc: "Modern UI with React + Tailwind CSS.",
            },{
              title: "Backend Development",
              desc: "Secure APIs and scalable backend systems.",
            },
          ].map((service, index) => (
            <div key={index}
              className="bg-white/90 backdrop-blur-md border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-semibold text-amber-500 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[{
              title: "Lumiere Restaurant Website",
              desc: "Modern restaurant UI using React + Tailwind.",
              link: "https://lumiereresturant-sample.netlify.app/",
            },{
              title: "Robo Sports Theme",
              desc: "A futuristic sports theme with React UI.",
              link: "https://robosports-theme-3.netlify.app/",
            },{
              title: "Ecostruct Company Website",
              desc: "Eco-friendly business site built with modern UI.",
              link: "https://ecostruct-sample.netlify.app/",
            },
          ].map((project, index) => (
            <div key={index}
              className="p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-amber-500 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.desc}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 font-medium hover:underline">
                View Project →
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Have a project idea? Let’s connect! </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:mirza.fasih99@example.com" className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-400 transition font-medium shadow-sm hover:shadow-md">
            Email Me
          </a>

          <a href="https://wa.me/923066899891"  target="_blank" rel="noopener noreferrer" 
            className="px-6 py-2 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-50 transition font-medium shadow-sm hover:shadow-md" >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Location</h2>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <iframe title="My Location - Sadiqabad Lalamusa"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13629.276632090504!2d73.9686381277849!3d32.68208384803531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1730569000000!5m2!1sen!2s"
            width="100%" height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <p className="mt-4 text-gray-600 text-sm">📍 Based in{" "}<span className="font-semibold text-amber-600">Sadiqabad, Lalamusa, Pakistan</span></p>
          
        <a href="https://goo.gl/maps/nz19hZtf3rncv2g7A" target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-block px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-400 transition font-medium shadow-sm hover:shadow-md">
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}

export default About;