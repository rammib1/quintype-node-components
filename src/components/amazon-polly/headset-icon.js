import React from "react";

const HeadsetIcon = ({ size, color = "#333", className}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g id="Icons/headset" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M8.2499851,12.7500149 C8.58852616,12.7500149 8.88149421,12.8737127 9.12888925,13.1211078 C9.3762843,13.3685028 9.49998212,13.6614709 9.49998212,14.0000119 L9.49998212,19 C9.49998212,19.3385411 9.3762843,19.6315091 9.12888925,19.8789042 C8.88149421,20.1262992 8.58852616,20.249997 8.2499851,20.249997 L7.62498659,20.249997 C6.92186327,20.249997 6.32941656,20.002602 5.84764708,19.5078113 C5.36587759,19.0130206 5.12499255,18.4270845 5.12499255,17.750003 L5.12499255,15.2500149 C5.12499255,14.5729274 5.36587759,13.9869913 5.84764708,13.4922006 C6.32941656,12.9974099 6.92186327,12.7500149 7.62499255,12.7500149 L8.2499851,12.7500149 Z M16.3749657,12.7500149 C17.0780891,12.7500149 17.6705358,12.9974099 18.1523052,13.4922006 C18.6340747,13.9869913 18.8749598,14.5729274 18.8749598,15.2500089 L18.8749598,17.750003 C18.8749598,18.4270845 18.6340747,19.0130206 18.1523052,19.5078113 C17.6705358,20.002602 17.0780891,20.249997 16.3749657,20.249997 L15.7499672,20.249997 C15.4114262,20.249997 15.1184581,20.1262992 14.8710631,19.8789042 C14.623668,19.6315091 14.4999702,19.3385411 14.4999702,19 L14.4999702,14.0000119 C14.4999702,13.6614709 14.623668,13.3685028 14.8710631,13.1211078 C15.1184581,12.8737127 15.4114262,12.7500149 15.7499672,12.7500149 L16.3749657,12.7500149 Z M11.9999762,2.75003874 C13.8228887,2.75003874 15.5025722,3.21878763 17.0390266,4.15628539 C18.4973563,5.04170014 19.6757391,6.25263476 20.5741745,7.78908923 C21.4726098,9.3255437 21.9478693,10.979186 21.9999523,12.7500149 L21.9999523,17.1250045 C21.9999523,17.3072959 21.9413587,17.4570349 21.8241715,17.5742221 C21.7069843,17.6914094 21.5572452,17.750003 21.3749538,17.750003 L20.7499553,17.750003 C20.5676639,17.750003 20.4179248,17.6914094 20.3007376,17.5742221 C20.1835504,17.4570349 20.1249568,17.3072959 20.1249568,17.1250045 L20.1249568,12.7500149 C20.1249568,11.2916852 19.7603745,9.93752161 19.0312094,8.68752459 C18.3020443,7.43752757 17.3124635,6.44794679 16.0624665,5.71878166 C14.8124695,4.98961654 13.4583058,4.62503427 11.9999762,4.62503427 C10.5416465,4.62503427 9.18748286,4.98961654 7.93748584,5.71878166 C6.68748882,6.44794679 5.69790805,7.43752757 4.96874292,8.68752459 C4.2395778,9.93752161 3.87499553,11.2916852 3.87499553,12.7500149 L3.87499553,17.1250045 C3.87499553,17.3072959 3.81640192,17.4570349 3.6992147,17.5742221 C3.58202748,17.6914094 3.43228845,17.750003 3.24999702,17.750003 L2.62499851,17.750003 C2.44270708,17.750003 2.29296805,17.6914094 2.17578083,17.5742221 C2.05859361,17.4570349 2,17.3072959 2,17.1250045 L2,12.7500149 C2.05208301,10.979186 2.52734249,9.3255437 3.42577785,7.78908923 C4.32421321,6.25263476 5.50259601,5.04170014 6.96092567,4.15628539 C8.49738014,3.21878763 10.1770636,2.75003874 11.9999762,2.75003874 Z" id="h" fill={color} fill-rule="nonzero"></path>
    </g>
  </svg>
);

export { HeadsetIcon };