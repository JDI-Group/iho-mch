import type { PropsWithDetailedHTML } from '@hairy/react-lib'

export function HomeFloatProjectsUnline(props: PropsWithDetailedHTML) {
  return (
    <div className={clsx('relative', props.className)} {...props}>
      <div className="w-full h-full flex justify-center items-center absolute">
        <div
          className="bg-white"
          style={{
            width: '20%',
            height: '55%',
            transformOrigin: 'center',
            transform: 'rotate(16deg) translateX(-7px) translateY(28px)',
            filter: 'blur(140px)',
            willChange: 'transform, filter',
          }}
        />
      </div>
      <svg className="relative z-19" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 700 830" fill="none">
        <rect x="111.674" y="59" width="490.000" height="690" fill="url(#pattern0_4582_147581)"></rect>
        <rect x="555.674" y="120" width="176.000" height="176" fill="url(#pattern1_4582_147581)" transform="rotate(-45 445.674 280.451)"></rect>
        <rect x="93.674" y="78" width="209.000" height="209" fill="url(#pattern2_4582_147581)"></rect>
        <rect x="514.674" y="409" width="236.304" height="236.304" transform="rotate(-40 424.674 589.894)" fill="url(#pattern3_4582_147581)"></rect>
        <rect x="329.674" y="615" width="211.000" height="211" fill="url(#pattern4_4582_14751)"></rect>
        <rect x="78.696" y="414" width="175.693" height="175.693" transform="rotate(11 128.696 594.499)" fill="url(#pattern5_4582_147581)"></rect>
        <defs>
          <pattern id="pattern0_4582_147581" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlinkHref="#image0_4582_147581" transform="matrix(0.00253807 0 0 0.0018018 -0.763959 0)"></use></pattern>
          <pattern id="pattern1_4582_147581" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlinkHref="#image1_4582_147581" transform="scale(0.00277778)"></use></pattern>
          <pattern id="pattern2_4582_147581" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlinkHref="#image2_4582_147581" transform="scale(0.002)"></use></pattern>
          <pattern id="pattern3_4582_147581" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlinkHref="#image3_4582_147581" transform="scale(0.00200401)"></use></pattern>
          <pattern id="pattern4_4582_14751" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlinkHref="#image4_4582_147581" transform="scale(0.00200401)"></use></pattern>
          <pattern id="pattern5_4582_147581" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlinkHref="#image5_4582_147581" transform="scale(0.002)"></use></pattern>
          <image id="image0_4582_147581" width="986" height="555" preserveAspectRatio="none" xlinkHref="/images/home.phone.png"></image>
          <image id="image1_4582_147581" width="360" height="360" preserveAspectRatio="none" xlinkHref="/images/home.device.watch.png"></image>
          <image id="image2_4582_147581" width="500" height="500" preserveAspectRatio="none" xlinkHref="/images/home.device.camera.png"></image>
          <image id="image3_4582_147581" width="499" height="499" preserveAspectRatio="none" xlinkHref="/images/home.device.ring.png"></image>
          <image id="image4_4582_147581" width="499" height="499" preserveAspectRatio="none" xlinkHref="/images/home.device.projection.png"></image>
          <image id="image5_4582_147581" width="500" height="500" preserveAspectRatio="none" xlinkHref="/images/home.device.speaker.png"></image>
        </defs>
      </svg>
    </div>
  )
}
