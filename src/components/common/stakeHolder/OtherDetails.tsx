import React from 'react'
interface IOtherDetails {
    stkId?: string
}
const OtherDetails: React.FC<IOtherDetails> = ({ stkId }) => {
    return (
        <div>OtherDetails</div>
    )
}

export default OtherDetails