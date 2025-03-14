import Logo2 from '../../../assets/full_logo_black.png';

const PageLoader = () => (
    <div className='w-screen h-screen backdrop-blur-sm bg-primary-50/70  flex justify-center items-center'>
        <img className="w-20 mb-10 animate-ping" src={Logo2} />
    </div>
);

export default PageLoader;