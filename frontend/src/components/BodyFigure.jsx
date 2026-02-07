import React from "react";

/**
 * Anatomical humanoid figure - Wireframe Mesh Style for Normal Dashboard.
 * Red = incomplete, Green = completed for that session.
 * Renders a high-fidelity wireframe mesh with internal contours.
 */
export default function BodyFigure({ bodyCompleted, className = "" }) {
  // Helper to get the base RGB color string based on status
  const getBaseRgb = (part) => (bodyCompleted[part] ? "34,197,94" : "239,68,68");

  // Style for the main outer shell of a body part (thicker, glowing)
  const mainStyle = (part) => {
    const rgb = getBaseRgb(part);
    return {
      stroke: `rgba(${rgb}, 1)`,
      strokeWidth: "2",
      fill: `rgba(${rgb}, 0.15)`, // Very subtle fill for body
      strokeLinecap: "round",
      strokeLinejoin: "round",
       // Optional: Adds a subtle glow effect if your CSS supports it,
       // otherwise it just looks like a clean line.
      filter: `drop-shadow(0 0 3px rgba(${rgb}, 0.7))`
    };
  };

  // Style for internal mesh lines and contours (thinner, more transparent)
  const detailStyle = (part) => {
    const rgb = getBaseRgb(part);
    return {
      stroke: `rgba(${rgb}, 0.5)`,
      strokeWidth: "1",
      fill: "none",
      strokeLinecap: "round"
    };
  };

  // Shared joint style (mechanical looking pivots)
  const jointStyle = (part) => ({
    stroke: `rgba(${getBaseRgb(part)}, 0.9)`,
    strokeWidth: "2",
    fill: "none"
  });

  return (
    <svg
      viewBox="0 0 240 420"
      className={className || "w-full max-w-[280px] md:max-w-[340px] h-auto aspect-[240/420] flex-shrink-0 drop-shadow-xl"}
      fill="none"
    >
        <defs>
            {/* Optional: Scanline pattern for extra "tech" feel. */}
            <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
                <path d="M0 4L4 0" stroke="currentColor" opacity="0.1" strokeWidth="0.5"/>
            </pattern>
        </defs>

      {/* --- HEAD & NECK --- */}
      <g id="head-group">
        {/* Main Cranium Shape */}
        <path d="M 102 30 C 102 12, 138 12, 138 30 C 138 45, 128 55, 120 62 C 112 55, 102 45, 102 30 Z" {...mainStyle("head")} />
        {/* Face/Wireframe details */}
        <path d="M 105 32 Q 120 38, 135 32" {...detailStyle("head")} /> {/* Brow */}
        <path d="M 110 42 Q 120 45, 130 42" {...detailStyle("head")} /> {/* Cheek line */}
        <path d="M 120 15 L 120 62" {...detailStyle("head")} opacity="0.3" /> {/* Center line */}

        {/* Neck segment with vertical muscle lines */}
        <path d="M 110 60 L 108 82 Q 120 86, 132 82 L 130 60" {...mainStyle("head")} />
        <path d="M 115 62 L 114 83 M 125 62 L 126 83" {...detailStyle("head")} />
      </g>


      {/* --- TORSO --- */}
      <g id="torso-group">
        {/* Chest (Pecs) - Split into left and right for detail */}
        <path d="M 120 84 L 80 88 C 70 95, 75 115, 85 122 C 100 128, 118 125, 120 118" {...mainStyle("stomach")} /> {/* Left Pec Outline */}
        <path d="M 120 84 L 160 88 C 170 95, 165 115, 155 122 C 140 128, 122 125, 120 118" {...mainStyle("stomach")} /> {/* Right Pec Outline */}

        {/* Chest Internal Mesh Details */}
        <path d="M 85 95 Q 100 100, 118 98 M 82 108 Q 100 115, 118 110" {...detailStyle("stomach")} />
        <path d="M 155 95 Q 140 100, 122 98 M 158 108 Q 140 115, 122 110" {...detailStyle("stomach")} />
        <path d="M 120 84 L 120 178" {...detailStyle("stomach")} strokeWidth="1.5" /> {/* Sternum/Center Line */}

        {/* Abdomen / Core Block */}
        <path d="M 85 122 L 90 165 C 92 185, 148 185, 150 165 L 155 122" {...mainStyle("stomach")} />
        {/* Abs Grid Mesh */}
        <path d="M 88 138 H 152 M 90 155 H 150" {...detailStyle("stomach")} /> {/* Horizontal Ab lines */}
        <path d="M 105 125 V 175 M 135 125 V 175" {...detailStyle("stomach")} /> {/* Vertical Ab lines */}
        <circle cx="120" cy="155" r="3" {...detailStyle("stomach")} /> {/* Navel Node */}
      </g>


      {/* --- LEFT ARM --- */}
      <g id="left-arm-group">
        {/* Shoulder Joint (Mechanical Pivot) */}
        <g transform="translate(75, 92)">
             <circle r="8" {...jointStyle("leftArm")} />
             <circle r="4" {...detailStyle("leftArm")} />
        </g>

        {/* Upper Arm (Bicep/Tricep) */}
        <path d="M 68 96 C 50 105, 55 135, 62 142 L 78 138 C 85 125, 80 100, 75 98" {...mainStyle("leftArm")} />
        <path d="M 65 115 Q 72 120, 79 112" {...detailStyle("leftArm")} /> {/* Bicep contour */}

        {/* Elbow Joint */}
        <g transform="translate(66, 146)">
             <circle r="7" {...jointStyle("leftArm")} />
             <line x1="-7" y1="0" x2="7" y2="0" {...detailStyle("leftArm")} />
        </g>

        {/* Forearm */}
        <path d="M 60 152 L 50 195 C 50 205, 70 205, 72 195 L 74 150" {...mainStyle("leftArm")} />
        <path d="M 65 155 L 58 195 M 68 155 L 66 195" {...detailStyle("leftArm")} /> {/* Forearm tendons */}

        {/* Hand (Mechanical Gauntlet style) */}
        <path d="M 52 202 L 45 225 L 55 235 L 68 228 L 70 202 Z" {...mainStyle("leftHand")} />
        <path d="M 55 228 L 55 210 M 62 230 L 62 208" {...detailStyle("leftHand")} /> {/* Finger bases */}
      </g>


      {/* --- RIGHT ARM --- */}
      <g id="right-arm-group">
        {/* Shoulder Joint */}
        <g transform="translate(165, 92)">
             <circle r="8" {...jointStyle("rightArm")} />
             <circle r="4" {...detailStyle("rightArm")} />
        </g>

        {/* Upper Arm */}
        <path d="M 172 96 C 190 105, 185 135, 178 142 L 162 138 C 155 125, 160 100, 165 98" {...mainStyle("rightArm")} />
        <path d="M 175 115 Q 168 120, 161 112" {...detailStyle("rightArm")} />

        {/* Elbow Joint */}
        <g transform="translate(174, 146)">
             <circle r="7" {...jointStyle("rightArm")} />
             <line x1="-7" y1="0" x2="7" y2="0" {...detailStyle("rightArm")} />
        </g>

        {/* Forearm */}
        <path d="M 180 152 L 190 195 C 190 205, 170 205, 168 195 L 166 150" {...mainStyle("rightArm")} />
        <path d="M 175 155 L 182 195 M 172 155 L 174 195" {...detailStyle("rightArm")} />

        {/* Hand */}
        <path d="M 188 202 L 195 225 L 185 235 L 172 228 L 170 202 Z" {...mainStyle("rightHand")} />
        <path d="M 185 228 L 185 210 M 178 230 L 178 208" {...detailStyle("rightHand")} />
      </g>


      {/* --- PELVIS & HIPS --- */}
      <g id="pelvis-group">
        {/* Mechanical Pelvic Girdle */}
        <path d="M 90 175 C 90 195, 110 205, 120 205 C 130 205, 150 195, 150 175" {...mainStyle("stomach")} fill="none" strokeWidth="3"/>
        {/* Hip Joints */}
        <circle cx="95" cy="195" r="10" {...jointStyle("leftLeg")} />
        <circle cx="145" cy="195" r="10" {...jointStyle("rightLeg")} />
      </g>


      {/* --- LEFT LEG --- */}
      <g id="left-leg-group">
        {/* Thigh (Quad) - Complex mesh shape */}
        <path d="M 92 205 C 80 240, 82 270, 88 288 L 115 285 C 120 260, 115 230, 108 205 Z" {...mainStyle("leftLeg")} />
        {/* Quad internal contour lines for thickness */}
        <path d="M 98 215 Q 105 250, 102 285" {...detailStyle("leftLeg")} />
        <path d="M 105 215 Q 112 250, 110 285" {...detailStyle("leftLeg")} />

        {/* Knee Joint (Mechanical Hinge) */}
        <g transform="translate(102, 298)">
            <circle r="10" {...jointStyle("leftLeg")} />
            <rect x="-10" y="-3" width="20" height="6" rx="2" {...detailStyle("leftLeg")} fill={getBaseRgb("leftLeg")} fillOpacity="0.5" />
        </g>

        {/* Calf/Shin */}
        <path d="M 98 310 C 92 340, 95 365, 98 375 L 118 372 C 122 360, 118 330, 114 310 Z" {...mainStyle("leftLeg")} />
        <path d="M 106 312 V 370" {...detailStyle("leftLeg")} /> {/* Shin bone line */}

        {/* Ankle & Foot (Mechanical Boot) */}
        <circle cx="108" cy="382" r="6" {...jointStyle("leftFoot")} />
        <path d="M 100 385 L 92 405 H 125 L 118 385 Z" {...mainStyle("leftFoot")} />
        <path d="M 96 400 H 120" {...detailStyle("leftFoot")} /> {/* Sole line */}
      </g>


      {/* --- RIGHT LEG --- */}
      <g id="right-leg-group">
         {/* Thigh (Quad) */}
        <path d="M 148 205 C 160 240, 158 270, 152 288 L 125 285 C 120 260, 125 230, 132 205 Z" {...mainStyle("rightLeg")} />
        {/* Quad internal contour lines */}
        <path d="M 142 215 Q 135 250, 138 285" {...detailStyle("rightLeg")} />
        <path d="M 135 215 Q 128 250, 130 285" {...detailStyle("rightLeg")} />

        {/* Knee Joint */}
        <g transform="translate(138, 298)">
            <circle r="10" {...jointStyle("rightLeg")} />
            <rect x="-10" y="-3" width="20" height="6" rx="2" {...detailStyle("rightLeg")} fill={getBaseRgb("rightLeg")} fillOpacity="0.5" />
        </g>

        {/* Calf/Shin */}
        <path d="M 142 310 C 148 340, 145 365, 142 375 L 122 372 C 118 360, 122 330, 126 310 Z" {...mainStyle("rightLeg")} />
        <path d="M 134 312 V 370" {...detailStyle("rightLeg")} />

        {/* Ankle & Foot */}
        <circle cx="132" cy="382" r="6" {...jointStyle("rightFoot")} />
        <path d="M 140 385 L 148 405 H 115 L 122 385 Z" {...mainStyle("rightFoot")} />
        <path d="M 144 400 H 120" {...detailStyle("rightFoot")} />
      </g>
    </svg>
  );
}