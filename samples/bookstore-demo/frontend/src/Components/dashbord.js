import {useState} from "react";

function Dashboard(){
    const[selectedValue, setSelectedValue] = useState('5m');

    // Options for the dropdown
    const options = [
        { label: '5 minutes', value: '5m' },
        { label: '10 minutes', value: '10m' },
        { label: '30 minutes', value: '30m' },
        { label: '1 hour', value: '1h' },
        { label: '2 hours', value: '2h' },
        { label: '6 hours', value: '6h' },
        { label: '12 hours', value: '12h' },
        { label: '24 hours', value: '24h' }
    ];

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    }

    const grafanaUrl = `/grafana/d/c654fe22-a10b-49a6-a3fe-626dee6f851e/redis-session-store?orgId=1&from=now-${selectedValue}&to=now&refresh=5s&kiosk`
    return (
        <div>
            <div>
                <label htmlFor="timeRange">Select Time Range:</label>
                <select className="ml-2 bg-redis-pencil-200 text-redis-pencil-950 rounded font-bold" id="timeRange" value={selectedValue} onChange={handleChange}>
                    {options.map((option, index) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div style={{width: '70%', height: '40vh'}}>
                <iframe
                    src={grafanaUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                ></iframe>
            </div>
        </div>
    );
}

export default Dashboard;