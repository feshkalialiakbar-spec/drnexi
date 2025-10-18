const Loading = ({
  color = '#7747C0',
}: {
  color?: string
}) => {
  return (
    <>
      <style>
        {`.loader {
        width: 50px;
        aspect-ratio: 1;
        box-shadow: 0 0 0 3px ${color} inset;
        border-radius: 50%;
        position: relative;
        animation: l8-0 1.5s linear infinite;
      }
      .loader:before {
        content: '';
        position: absolute;
        top: 50%;
        left: calc(100% + 2px);
        box-shadow: inherit;
        width: 25px;
        aspect-ratio: 1;
        border-radius: 50%;
        animation: l8-1 1.5s linear infinite;
      }
      @keyframes l8-1 {
        0% {
          transform-origin: -27px 50%;
          width: 20px;
          transform: translateY(-50%) rotate(0);
        }
        100% {
          transform-origin: -12px 50%;
          width: 50px;
          transform: translateY(-50%) rotate(180deg);
        }
      }
      @keyframes l8-0 {
        0% {
          width: 50px;
          transform: translate(0);
        }
        100% {
          width: 20px;
          transform: translate(37px);
        }
      }`}
      </style>

      <div className='loader'></div>
    </>
  )
}

export default Loading
