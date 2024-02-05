import { useState } from "react";

const groceryItems = [];

export default function App() {

  const [items, setItems] = useState(groceryItems);

  function handleAddItem(item){
     setItems([...items, item]);
  }

  function handleDeleteItem(id){
      setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id){
      setItems((items) => items.map((item) => (item.id === id ? {...item, checked: !item.checked }: item)));
  }

  function handleClearItems(){
      setItems([]);
  }

  return (
    <div className="app">
    <Header/>
    <Form onAddItem= {handleAddItem}/>
    <GroceryList items={items} onDeleteItem= {handleDeleteItem} onToggleItem={handleToggleItem} onClearItems={handleClearItems}/>
    <Footer items={items} />
  </div>
  );
}


function Header(){
  return (
    <>
    <h1>Catatan Belanja Raja Aqiqah 📒</h1> 
    <h3>Belanja Hari ini</h3>
    </>
  )
}

function Form({onAddItem}){
  
  const [name,setName] = useState ('');
  const [quantity,setQuantity] = useState ('');
  const [unit,setUnit] = useState ('');


  function handleSubmit(e){
    e.preventDefault();

    if(!name) return;

    const newItem = {name, quantity, unit, checked: false, id: Date.now()};
    onAddItem(newItem);


    console.log(newItem);
    setName('');
    setQuantity(1);
    setUnit('Kg')
  }

  const quantityNum = [...Array(100)].map((_,i) =>(
    <option value={i + 1} key={i + 1}>{i + 1}</option>
  ));
  
  return (
    <form className="add-form" onSubmit={handleSubmit}>
    <div>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
      {quantityNum}
      </select>
      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="Kg">Kg</option>
        <option value="Pcs">Pcs</option>
        <option value="Ons">Ons</option>
        <option value="Sak">Sak</option>
        <option value="Liter">Liter</option>
      </select>
        <input type="text" placeholder="nama barang......." value={name} onChange={(e) => setName(e.target.value)}/>
    </div>
        <button>Tambah</button>
    </form>
  )
}

function GroceryList({items, onDeleteItem, onToggleItem, onClearItems}){
  const [sortBy, setSortBy] = useState('input');
  
  let sortedItems;

  switch(sortBy){
    case 'name':
      sortedItems = items.slice().sort((a,b) => a.name.localeCompare(b.name));
      break;
    case 'checked':
      sortedItems = items.slice().sort((a,b) => a.checked-b.checked);
      break;
    default:
      sortedItems = items;
      break;
    }

  return (
    <>
      <div className="list">
      <ul>
        {sortedItems.map((item) => (
        <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem}/>
        ))}
      </ul>
      </div>
      <div className="actions">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="input">Urutkan berdasarkan urutan input</option>
        <option value="name">Urutkan berdasarkan nama barang</option>
        <option value="checked">Urutkan berdasarkan ceklis</option>
      </select>
      <button onClick={onClearItems}>Bersihkan Daftar</button>
      </div>
    </>
  )
}

function Item({item, onDeleteItem, onToggleItem}){
  return (
    <>
    <li key={item.id}>
      <input type="checkbox" checked = {item.checked} onChange={()=> onToggleItem(item.id)}/>
        <span style={item.checked ? {textDecoration : 'line-through'} :{}}>
          {item.quantity} {item.unit} {item.name}
        </span>
      <button onClick={() => onDeleteItem(item.id)}>&times;</button>
    </li>
    </>
  );
}

function Footer({items}){
  if(items.length === 0){
    return <footer className="stats">Barang Belanjaan Masih Kosong!!!</footer>
  }

  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;
  const percentage = Math.round((checkedItems/totalItems) * 100);
  return <footer className="stats">Ada {totalItems} barang di daftar belanjaan, {checkedItems} barang sudah dibeli ({percentage}%)</footer>
}