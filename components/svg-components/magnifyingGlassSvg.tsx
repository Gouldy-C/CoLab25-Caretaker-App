import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"


const MagnifyingGlassSvg = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill={props.fill}
    scale={props.scale}
    stroke={props.stroke}
  >
    <Path
      fill="#424052"
      d="M10.82 20.84c-2.833 0-5.233-.983-7.198-2.948C1.656 15.927.673 13.54.673 10.732s.983-5.195 2.948-7.16C5.586 1.607 7.975.624 10.787.624c2.813 0 5.201.983 7.166 2.948 1.964 1.965 2.947 4.352 2.947 7.16 0 1.175-.2 2.312-.6 3.41a9.694 9.694 0 0 1-1.689 2.946l9.962 9.916c.2.193.304.441.309.746a1.01 1.01 0 0 1-.31.768 1.052 1.052 0 0 1-.765.312c-.3 0-.55-.106-.754-.317l-9.933-9.934a9.048 9.048 0 0 1-2.892 1.67 10.002 10.002 0 0 1-3.408.59Zm-.017-2.094c2.234 0 4.126-.777 5.677-2.332 1.55-1.554 2.326-3.449 2.326-5.682 0-2.234-.776-4.128-2.326-5.682-1.551-1.555-3.443-2.332-5.677-2.332-2.243 0-4.143.777-5.7 2.332-1.557 1.554-2.336 3.448-2.336 5.682 0 2.234.779 4.128 2.336 5.682 1.557 1.555 3.457 2.332 5.7 2.332Z"
    />
  </Svg>
)
export default MagnifyingGlassSvg
