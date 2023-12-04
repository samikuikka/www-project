"use client";

import Globe from "react-globe.gl";
import { useEffect, useRef, useState } from "react";
import * as topojson from "topojson";
import { MeshLambertMaterial, DoubleSide } from "three";
import globeJson from "@/components/globe.json";

export const GlobeComponent = () => {
  const [globeSize, setGlobeSize] = useState(getInitialGlobeSize());
  const polygonData = (
    topojson.feature(globeJson as any, globeJson.objects.land as any) as any
  ).features;

  const globeEl = useRef<any>();
  const globeContainerRef = useRef<HTMLDivElement>(null);

  const polygonsMaterial = new MeshLambertMaterial({
    color: "rgb(33, 29, 29)",
    side: DoubleSide,
  });

  const polygonsMaterial2 = new MeshLambertMaterial({
    color: "rgb(28, 34, 43)",
    side: DoubleSide,
  });

  useEffect(() => {
    const handleResize = () => {
      // Update the globe size based on the container's size or window size
      setGlobeSize({
        width: globeContainerRef.current?.clientWidth || window.innerWidth,
        height: globeContainerRef.current?.clientHeight || window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.7;
    }
  }, []);

  useEffect(() => {
    // aim at continental US centroid
    globeEl.current.pointOfView({ lat: 39.6, lng: -98.5, altitude: 2 });
  }, []);

  function getInitialGlobeSize() {
    // Define initial size based on the current window size or a default value
    return { width: window.innerWidth, height: window.innerHeight };
  }

  console.log(globeSize.width);

  return (
    <div className="h-full w-full ">
      <div ref={globeContainerRef} className="h-full w-full">
        <Globe
          ref={globeEl}
          width={globeSize.width}
          height={globeSize.width}
          polygonsData={polygonData}
          polygonCapMaterial={polygonsMaterial}
          globeMaterial={polygonsMaterial2}
          backgroundColor="rgba(0,0,0,0)"
          polygonSideColor={() => "rgba(173, 216, 230, 0.5)"} // Light blue color
          atmosphereColor="white"
          atmosphereAltitude={0.2} // Adjust atmosphere thickness/>
        />
      </div>
    </div>
  );
};
