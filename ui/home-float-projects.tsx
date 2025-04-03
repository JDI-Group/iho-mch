import { variants } from '@/config/variants'

export function HomeFloatProjects() {
  return (
    <div className="h-full w-full relative">
      <div className="w-full h-full flex justify-center items-center absolute">
        <div
          className="bg-white"
          style={{
            width: '20%',
            height: '55%',
            transformOrigin: 'center',
            transform: 'rotate(16deg) translateX(29px) translateY(35px)',
            filter: 'blur(140px)',
            willChange: 'transform, filter',
          }}
        />
      </div>
      <svg className="relative z-19" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 700 1085" fill="none">
        <motion.g variants={variants.stagger} initial="hidden" animate="visible">
          <motion.path variants={variants.line} opacity="0.3" d="M313.164 3C303.33 57.1773 303.263 171.992 381.67 197.833C460.077 223.674 501.681 279.014 512.682 303.453" stroke="white" strokeWidth="12" />
          <motion.path variants={variants.line} opacity="0.3" d="M556.311 336.198C617.908 400.188 721.353 555.572 642.359 665.187C563.364 774.803 437.819 784.603 384.921 775.802" stroke="white" strokeWidth="12" />
          <motion.path variants={variants.line} opacity="0.3" d="M495.673 656.006C451.506 689.558 333.273 754.842 213.673 747.558C94.073 740.274 58.173 792.744 31.173 857.32C9.006 909.756 8.573 1005.62 184.173 969.61C359.773 933.596 477.339 1035.2 514.173 1090.5" stroke="white" strokeWidth="12" />
        </motion.g>

        <rect className="animate-[levitate_12s_ease_infinite_1s]" x="161.674" y="239" width="490" height="690" fill="url(#pattern0_4582_14758)" />
        <rect className="animate-[levitate_10s_ease_infinite]" x="445.674" y="280.451" width="176" height="176" transform="rotate(-45 445.674 280.451)" fill="url(#pattern1_4582_14758)" />
        <rect className="animate-[levitate_13s_ease_infinite_1s_reverse]" x="143.674" y="258" width="209" height="209" fill="url(#pattern2_4582_14758)" />
        <rect className="animate-[levitate_16s_ease_infinite]" x="424.674" y="589.894" width="236.304" height="236.304" transform="rotate(-40 424.674 589.894)" fill="url(#pattern3_4582_14758)" />
        <rect className="animate-[levitate_17s_ease_infinite_1s]" x="379.674" y="795" width="211" height="211" fill="url(#pattern4_4582_14758)" />
        <rect className="animate-[levitate_16s_ease_infinite]" x="128.696" y="594.499" width="175.693" height="175.693" transform="rotate(11 128.696 594.499)" fill="url(#pattern5_4582_14758)" />

        <defs>
          <pattern id="pattern0_4582_14758" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_4582_14758" transform="matrix(0.00253807 0 0 0.0018018 -0.763959 0)" />
          </pattern>
          <pattern id="pattern1_4582_14758" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image1_4582_14758" transform="scale(0.00277778)" />
          </pattern>
          <pattern id="pattern2_4582_14758" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image2_4582_14758" transform="scale(0.002)" />
          </pattern>
          <pattern id="pattern3_4582_14758" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image3_4582_14758" transform="scale(0.00200401)" />
          </pattern>
          <pattern id="pattern4_4582_14758" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image4_4582_14758" transform="scale(0.00200401)" />
          </pattern>
          <pattern id="pattern5_4582_14758" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image5_4582_14758" transform="scale(0.002)" />
          </pattern>
          <image id="image0_4582_14758" width="986" height="555" preserveAspectRatio="none" xlinkHref="/images/home.phone.png" />
          <image id="image1_4582_14758" width="360" height="360" preserveAspectRatio="none" xlinkHref="/images/home.device.watch.png" />
          <image id="image2_4582_14758" width="500" height="500" preserveAspectRatio="none" xlinkHref="/images/home.device.camera.png" />
          <image id="image3_4582_14758" width="499" height="499" preserveAspectRatio="none" xlinkHref="/images/home.device.ring.png" />
          <image id="image4_4582_14758" width="499" height="499" preserveAspectRatio="none" xlinkHref="/images/home.device.projection.png" />
          <image id="image5_4582_14758" width="500" height="500" preserveAspectRatio="none" xlinkHref="/images/home.device.speaker.png" />
        </defs>
      </svg>
    </div>
  )
}
