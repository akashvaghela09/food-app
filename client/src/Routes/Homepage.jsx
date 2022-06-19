import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadData } from "../Utils/localstorage"
import { GiSettingsKnobs } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FcSearch } from "react-icons/fc";
import axios from "axios";

const Homepage = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [list, setList] = useState([]);
    const [filteredItems, setFilterItems] = useState([]);
    const [modal, setModal] = useState(false);
    const [filterList, setFilterList] = useState({ Beverage: false, Chinese: false, Continental: false, Pizza: false });
    const [sortPrice, setSortPrice] = useState({});

    const handleRoute = (para) => {
        navigate(`/${para}`)
    }

    const checkIfLoggedIn = () => {
        let token = loadData("token");
        let email = loadData("email");
        let auth = loadData("auth");

        if (
            token === null || token === undefined || token === "" ||
            email === null || email === undefined || email === "" ||
            auth === null || auth === undefined || auth === ""
        ) {
            handleRoute("login")
        } else {
            setLoading(false);
            getResults();
        }
    }

    const getResults = () => {
        let token = loadData("token");
        axios.get(`${process.env.REACT_APP_DATABASE_URL}/restaurant`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                let data = res.data.data;
                setList([...data])
                setFilterItems([...data])
                setQuery("")
            })
    }

    const handleSearch = () => {
        console.log("searching for items..")

        let tempList = []

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            if (filterList[item["cuisines"]] === true) {
                tempList.push(item)
            }
        }

        // if no filter selected
        if (filterList.Beverage === false &&
            filterList.Chinese === false &&
            filterList.Continental === false &&
            filterList.Pizza === false) {
            tempList = [...list]
        }

        // sort based on price
        tempList.sort((a, b) => {
            if (sortPrice.price === "L-H") {
                return a.price - b.price
            } else if (sortPrice.price === "H-L") {
                return b.price - a.price
            }
        })

        // search for query
        if(query.length > 2){
            let searchResult = []

            for(let i = 0; i < tempList.length; i++){
                let str = "";
                for(let j = 0; j < tempList[i].name.length; j++){
                    str += tempList[i].name[j].toLowerCase()

                    if(str.includes(query.toLowerCase())){
                        searchResult.push(tempList[i])
                        break
                    }
                }
            }

            setFilterItems([...searchResult])
        } else {
            setFilterItems([...tempList])
        }
    }

    const handleClearFilter = () => {
        setModal(false)
        setSortPrice({})
        setFilterList({ Beverage: false, Chinese: false, Continental: false, Pizza: false })
        setFilterItems([...list])
    }

    const handleSearchClear = () => {
        setQuery("")
        handleClearFilter()
    }

    const handleApplyFilter = () => {
        setModal(false)
        handleSearch()
    }

    const addToFilter = (para) => {
        let newFilterList = { ...filterList };
        newFilterList[para] = !newFilterList[para];
        setFilterList(newFilterList);
    }

    useEffect(() => {
        checkIfLoggedIn()
    }, [])

    return (
        <div className='w-full h-full flex justify-center items-center'>
            {
                loading ? <div className='text-3xl text-slate-900'>Loading...</div> :
                    <div className='flex flex-col items-center w-full h-full'>
                        <div className='flex items-center w-11/12 md:4/5'>
                            <div className='w-11/12 md:4/5 bg-slate-200 flex rounded my-8 drop-shadow'>
                                <label className='w-full relative'>
                                <input className='w-full p-3 rounded-l' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Restaurant name...' />
                                    {
                                        query.length > 0 && <IoClose onClick={() => handleSearchClear()} className='text-3xl text-slate-500 cursor-pointer absolute top-[10px] right-2'/>
                                    }
                                </label>
                                <button onClick={() => handleSearch()} className='hidden md:block bg-blue-500 text-slate-100 p-3 px-6 text-xl rounded-r'>Search</button>
                                <label onClick={() => handleSearch()} className='md:hidden cursor-pointer bg-blue-500 rounded-r flex justify-center items-center p-2'>
                                    <FcSearch className=' text-slate-100 text-3xl ' />
                                </label>
                            </div>
                            <div className='relative border-[1px] mx-4 p-2 bg-slate-200 rounded'>
                                {
                                    modal === false ?
                                        <GiSettingsKnobs onClick={() => setModal(true)} className='text-3xl cursor-pointer' />
                                        :
                                        <IoClose onClick={() => setModal(false)} className='text-3xl cursor-pointer' />
                                }
                                {
                                    modal === true &&
                                    <div className='z-20 absolute top-14 right-0 bg-slate-200 rounded w-fit h-fit px-2 drop-shadow-lg'>
                                        <div className='m-2'>
                                            <p className='px-1 font-bold w-max'>Sort by price</p>
                                            <label className='flex items-center ml-1'>
                                                <input checked={sortPrice.price === "L-H" ? true : false} onChange={() => setSortPrice({ price: "L-H" })} value="L-H" type="radio" name="price" />
                                                <p className='cursor-pointer text-sm m-1 pl-2 w-max'>Lowest to highest</p>
                                            </label>
                                            <label className='flex items-center ml-1'>
                                                <input checked={sortPrice.price === "H-L" ? true : false} onChange={() => setSortPrice({ price: "H-L" })} value="H-L" type="radio" name="price" />
                                                <p className='cursor-pointer text-sm m-1 pl-2 w-max'>Highest to lowest</p>
                                            </label>
                                        </div>
                                        <div className='m-2'>
                                            <p className='px-1 font-bold w-max'>Filter by cuisine</p>
                                            <label className='flex items-center ml-1'>
                                                <input checked={filterList.Beverage} onChange={() => addToFilter("Beverage")} type="checkbox" />
                                                <p className='cursor-pointer text-sm m-1 pl-2 w-max'>Beverage</p>
                                            </label>
                                            <label className='flex items-center ml-1'>
                                                <input checked={filterList.Chinese} onChange={() => addToFilter("Chinese")} type="checkbox" />
                                                <p className='cursor-pointer text-sm m-1 pl-2 w-max'>Chinese</p>
                                            </label>
                                            <label className='flex items-center ml-1'>
                                                <input checked={filterList.Continental} onChange={() => addToFilter("Continental")} type="checkbox" />
                                                <p className='cursor-pointer text-sm m-1 pl-2 w-max'>Continental</p>
                                            </label>
                                            <label className='flex items-center ml-1'>
                                                <input checked={filterList.Pizza} onChange={() => addToFilter("Pizza")} type="checkbox" />
                                                <p className='cursor-pointer text-sm m-1 pl-2 w-max'>Pizza</p>
                                            </label>
                                        </div>
                                        <label className='flex mb-1'>
                                            <p onClick={() => handleClearFilter()} className='cursor-pointer hover:bg-red-600 p-1 m-1 rounded text-center text-sm bg-red-500 text-slate-200'>Clear Filter</p>
                                            <p onClick={() => handleApplyFilter()} className='cursor-pointer hover:bg-blue-600 p-1 m-1 rounded text-center text-sm bg-blue-500 text-slate-200'>Apply Filter</p>
                                        </label>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className=' w-11/12 flex flex-wrap justify-center pb-12'>
                            {
                                filteredItems.length !== undefined &&
                                filteredItems.length > 0 &&
                                filteredItems.map((el, index) => {
                                    return (
                                        <div className='w-4/5 md:w-5/12 lg:w-3/12 overflow-auto bg-slate-200 m-2 md:m-4 rounded drop-shadow flex' key={"key-" + index}>
                                            <div className='w-[35%] h-full'>
                                                <img className='w-full h-full' src={`${el.cuisines}.png`} alt={el.cuisines} />
                                            </div>
                                            <div className="flex flex-col p-2 w-[65%]">
                                                <p className='font-bold line-clamp-2'>{el.name}</p>
                                                <p className='text-slate-600 text-sm'>{el.cuisines}</p>
                                                <p className=''>${el.price}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export { Homepage }