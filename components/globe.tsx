"use client";

import Globe from "react-globe.gl";
import { useEffect, useRef, useState } from "react";
import * as topojson from "topojson";
import * as THREE from "three";

export const GlobeComponent = () => {
  const [landPolygons, setLandPolygons] = useState([]);
  const [globeSize, setGlobeSize] = useState(getInitialGlobeSize());

  const globeEl = useRef<any>();
  const globeContainerRef = useRef<HTMLDivElement>(null);

  const polygonsMaterial = new THREE.MeshLambertMaterial({
    color: "rgb(33, 29, 29)",
    side: THREE.DoubleSide,
  });

  const polygonsMaterial2 = new THREE.MeshLambertMaterial({
    color: "rgb(28, 34, 43)",
    side: THREE.DoubleSide,
  });

  useEffect(() => {
    // load data
    fetch("//unpkg.com/world-atlas/land-110m.json")
      .then((res) => res.json())
      .then((landTopo) => {
        setLandPolygons(
          // @ts-ignore
          topojson.feature(landTopo, landTopo.objects.land).features,
        );
      });
  }, []);

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
          polygonsData={landPolygons}
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
